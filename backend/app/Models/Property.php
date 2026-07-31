<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Model;

/**
 * Modèle pour la table properties.
 */
final class Property extends Model
{
    protected string $table = 'properties';

    /**
     * Liste les annonces validées pour le public.
     */
    public function getPublicListings(): array
    {
        $sql = "SELECT p.*, u.nom as owner_name,
                       (SELECT file_url FROM documents WHERE property_id = p.id AND type = 'photo' ORDER BY id ASC LIMIT 1) as image_url
                FROM {$this->table} p 
                LEFT JOIN users u ON p.owner_id = u.id 
                WHERE p.statut IN ('valide', 'assigne', 'en_attente')
                ORDER BY p.created_at DESC";
        return $this->db->query($sql)->fetchAll();
    }

    /**
     * Crée une annonce.
     */
    public function create(array $data, int $ownerId): int
    {
        $sql = "INSERT INTO {$this->table} 
                (owner_id, titre, description, prix, commune, quartier, latitude, longitude, superficie, chambres, sdb, type_bien, statut, panorama_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente', ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $ownerId,
            $data['titre'],
            $data['description'] ?? null,
            $data['prix'],
            $data['commune'],
            $data['quartier'] ?? null,
            $data['latitude'] ?? null,
            $data['longitude'] ?? null,
            $data['superficie'] ?? null,
            $data['chambres'] ?? 0,
            $data['sdb'] ?? 0,
            $data['type_bien'] ?? 'terrain',
            $data['panorama_url'] ?? null
        ]);
        return (int) $this->db->lastInsertId();
    }

    /**
     * Récupère un bien avec les détails de l'agent.
     */
    public function findWithDetails(int $id): ?array
    {
        $sql = "SELECT p.*, 
                       u.nom as owner_name, 
                       a.nom as agent_name, 
                       a.telephone as agent_phone, 
                       a.email as agent_email
                FROM {$this->table} p 
                LEFT JOIN users u ON p.owner_id = u.id 
                LEFT JOIN users a ON p.agent_id = a.id 
                WHERE p.id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Valide une annonce (par un agent).
     */
    public function validate(int $id, int $agentId, string $panoramaUrl): bool
    {
        $sql = "UPDATE {$this->table} SET statut = 'valide', agent_id = ?, panorama_url = ? WHERE id = ?";
        return $this->db->prepare($sql)->execute([$agentId, $panoramaUrl, $id]);
    }

    /**
     * Assigne un agent à une annonce pour validation terrain.
     */
    public function assignAgent(int $propertyId, int $agentId): bool
    {
        $sql = "UPDATE {$this->table} SET agent_id = ?, statut = 'assigne' WHERE id = ?";
        return $this->db->prepare($sql)->execute([$agentId, $propertyId]);
    }

    /**
     * Missions en attente pour un agent spécifique.
     */
    public function getPendingMissions(?int $agentId = null): array
    {
        if ($agentId) {
            $sql = "SELECT p.*, u.nom as owner_name 
                    FROM {$this->table} p 
                    JOIN users u ON p.owner_id = u.id 
                    WHERE p.agent_id = ? AND p.statut = 'assigne'";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$agentId]);
            return $stmt->fetchAll();
        }
        $sql = "SELECT p.*, u.nom as owner_name 
                FROM {$this->table} p 
                JOIN users u ON p.owner_id = u.id 
                WHERE p.statut = 'en_attente'";
        return $this->db->query($sql)->fetchAll();
    }

    /**
     * Rejette une annonce pour cause de litige ou non-conformité.
     */
    public function reject(int $id, int $agentId, string $reason): bool
    {
        $sql = "UPDATE {$this->table} SET statut = 'rejete', rejection_reason = ? WHERE id = ? AND agent_id = ?";
        return $this->db->prepare($sql)->execute([$reason, $id, $agentId]);
    }
}
