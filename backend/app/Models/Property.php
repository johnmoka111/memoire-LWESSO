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
        $sql = "SELECT p.*, u.nom as owner_name 
                FROM {$this->table} p 
                JOIN users u ON p.owner_id = u.id 
                WHERE p.statut = 'valide' 
                ORDER BY p.created_at DESC";
        return $this->db->query($sql)->fetchAll();
    }

    /**
     * Crée une annonce.
     */
    public function create(array $data, int $ownerId): int
    {
        $sql = "INSERT INTO {$this->table} 
                (owner_id, titre, description, prix, commune, quartier, latitude, longitude, superficie, type_bien, statut) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')";
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
            $data['type_bien'] ?? 'terrain'
        ]);
        return (int) $this->db->lastInsertId();
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
            $sql = "SELECT * FROM {$this->table} WHERE agent_id = ? AND statut = 'assigne'";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$agentId]);
            return $stmt->fetchAll();
        }
        return $this->db->query("SELECT * FROM {$this->table} WHERE statut = 'en_attente'")->fetchAll();
    }
}
