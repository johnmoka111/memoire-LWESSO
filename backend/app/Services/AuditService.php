<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use PDO;

final class AuditService
{
    private static bool $tableReady = false;

    private static function ensureTable(): void
    {
        if (self::$tableReady) return;
        Database::getInstance()->exec("CREATE TABLE IF NOT EXISTS system_logs (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NULL,
            event_type VARCHAR(100) NOT NULL,
            description VARCHAR(500) NOT NULL,
            method VARCHAR(10) NULL,
            route VARCHAR(255) NULL,
            ip_address VARCHAR(45) NULL,
            metadata JSON NULL,
            user_agent TEXT NULL,
            device VARCHAR(160) NULL,
            archived_at DATETIME NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_created_at (created_at), INDEX idx_user_id (user_id), INDEX idx_event_type (event_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        foreach ([
            'ALTER TABLE system_logs ADD COLUMN user_agent TEXT NULL',
            'ALTER TABLE system_logs ADD COLUMN device VARCHAR(160) NULL',
            'ALTER TABLE system_logs ADD COLUMN archived_at DATETIME NULL',
        ] as $migration) {
            try { Database::getInstance()->exec($migration); } catch (\Throwable) { }
        }
        self::$tableReady = true;
    }

    public static function describeAction(string $handler, string $method): string
    {
        $labels = [
            'AuthController@login' => 'Connexion au système',
            'UserController@updateProfile' => 'Mise à jour du profil',
            'AdminController@createAgent' => 'Création d’un agent',
            'AdminController@updateAgent' => 'Modification du statut ou du profil d’un agent',
            'AdminController@deleteAgent' => 'Suppression d’un agent',
            'AdminController@resetAgentPassword' => 'Réinitialisation du mot de passe d’un agent',
            'PropertyController@store' => 'Création d’une annonce',
            'PropertyController@validate' => 'Validation d’une annonce',
            'TransactionController@store' => 'Création d’une transaction',
        ];
        return $labels[$handler] ?? "Action {$method} : {$handler}";
    }

    private static function device(): string
    {
        $agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Appareil inconnu';
        $platform = str_contains($agent, 'Windows') ? 'Windows' : (str_contains($agent, 'Android') ? 'Android' : (str_contains($agent, 'iPhone') || str_contains($agent, 'iPad') ? 'iOS' : (str_contains($agent, 'Mac OS') ? 'macOS' : 'Autre OS')));
        $browser = str_contains($agent, 'Edg/') ? 'Edge' : (str_contains($agent, 'Firefox/') ? 'Firefox' : (str_contains($agent, 'Chrome/') ? 'Chrome' : (str_contains($agent, 'Safari/') ? 'Safari' : 'Navigateur inconnu')));
        return "{$browser} sur {$platform}";
    }

    public static function archiveExpired(): void
    {
        self::ensureTable();
        $db = Database::getInstance();
        $logs = $db->query('SELECT * FROM system_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) AND archived_at IS NULL ORDER BY id')->fetchAll();
        if (!$logs) return;
        $directory = ROOT_PATH . '/storage/logs';
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) return;
        $file = $directory . '/system_logs_' . date('Ymd_His') . '.json';
        if (file_put_contents($file, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) return;
        $ids = array_column($logs, 'id');
        $marks = implode(',', array_fill(0, count($ids), '?'));
        $db->prepare("UPDATE system_logs SET archived_at = NOW() WHERE id IN ({$marks})")->execute($ids);
        $db->prepare("DELETE FROM system_logs WHERE id IN ({$marks})")->execute($ids);
    }

    public static function log(?int $userId, string $eventType, string $description, ?string $method = null, ?string $route = null, array $metadata = []): void
    {
        try {
            self::ensureTable();
            self::archiveExpired();
            $agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
            Database::getInstance()->prepare('INSERT INTO system_logs (user_id, event_type, description, method, route, ip_address, metadata, user_agent, device) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute([
                $userId, $eventType, $description, $method, $route, $_SERVER['REMOTE_ADDR'] ?? null,
                $metadata ? json_encode($metadata, JSON_UNESCAPED_UNICODE) : null,
                $agent, self::device(),
            ]);
        } catch (\Throwable) {
            // L'audit ne doit jamais interrompre l'action demandée.
        }
    }

    public static function list(int $page, int $limit, string $search = ''): array
    {
        self::ensureTable();
        $db = Database::getInstance();
        $where = '';
        $params = [];
        if ($search !== '') { $where = 'WHERE l.description LIKE :search OR l.event_type LIKE :search OR u.email LIKE :search'; $params[':search'] = "%{$search}%"; }
        $count = $db->prepare("SELECT COUNT(*) FROM system_logs l LEFT JOIN users u ON u.id = l.user_id {$where}");
        $count->execute($params);
        $total = (int) $count->fetchColumn();
        $pages = max(1, (int) ceil($total / $limit));
        $page = min(max(1, $page), $pages);
        $offset = ($page - 1) * $limit;
        $stmt = $db->prepare("SELECT l.*, u.nom, u.prenom, u.email FROM system_logs l LEFT JOIN users u ON u.id = l.user_id {$where} ORDER BY l.created_at DESC LIMIT :limit OFFSET :offset");
        foreach ($params as $key => $value) $stmt->bindValue($key, $value);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return ['items' => $stmt->fetchAll(), 'pagination' => ['page' => $page, 'limit' => $limit, 'total' => $total, 'total_pages' => $pages]];
    }
}
