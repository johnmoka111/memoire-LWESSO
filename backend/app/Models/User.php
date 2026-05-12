<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Model;

/**
 * Modèle pour la table users.
 */
final class User extends Model
{
    protected string $table = 'users';

    /**
     * Recherche un utilisateur par email.
     */
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE email = ?");
        $stmt->execute([$email]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Crée un nouvel utilisateur.
     */
    public function create(array $data): int
    {
        $sql = "INSERT INTO {$this->table} (nom, prenom, email, password, role, wallet_address, avatar_url, province, ville, commune) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['nom'],
            $data['prenom'],
            $data['email'],
            password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            $data['role'] ?? 'acheteur',
            $data['wallet_address'] ?? null,
            $data['avatar_url'] ?? null,
            $data['province'] ?? null,
            $data['ville'] ?? null,
            $data['commune'] ?? null
        ]);
        return (int) $this->db->lastInsertId();
    }
}
