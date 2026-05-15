<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Model;

/**
 * Modèle pour la table notifications.
 */
final class Notification extends Model
{
    protected string $table = 'notifications';

    /**
     * Crée une notification.
     */
    public function create(array $data): int
    {
        $sql = "INSERT INTO {$this->table} (user_id, title, message, type) VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['user_id'],
            $data['title'],
            $data['message'],
            $data['type'] ?? 'info'
        ]);
        return (int) $this->db->lastInsertId();
    }

    /**
     * Récupère les notifications d'un utilisateur.
     */
    public function getForUser(int $userId): array
    {
        $sql = "SELECT * FROM {$this->table} WHERE user_id = ? ORDER BY created_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    /**
     * Marque comme lu.
     */
    public function markAsRead(int $id): bool
    {
        $sql = "UPDATE {$this->table} SET is_read = TRUE WHERE id = ?";
        return $this->db->prepare($sql)->execute([$id]);
    }
}
