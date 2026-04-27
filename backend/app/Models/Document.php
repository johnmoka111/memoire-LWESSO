<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Model;

/**
 * Modèle pour la table documents.
 */
final class Document extends Model
{
    protected string $table = 'documents';

    /**
     * Enregistre un document et son hash.
     */
    public function register(array $data): int
    {
        $sql = "INSERT INTO {$this->table} 
                (property_id, uploaded_by, type, nom_fichier, file_url, mime_type, taille_bytes, sha256_hash) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['property_id'],
            $data['uploaded_by'],
            $data['type'],
            $data['nom_fichier'],
            $data['file_url'],
            $data['mime_type'],
            $data['taille_bytes'],
            $data['sha256_hash']
        ]);
        return (int) $this->db->lastInsertId();
    }

    /**
     * Met à jour les informations blockchain d'un document.
     */
    public function updateBlockchainInfo(int $id, string $hashBlockchain, string $txHash): bool
    {
        $sql = "UPDATE {$this->table} SET hash_blockchain = ?, tx_hash = ?, anchored_at = NOW() WHERE id = ?";
        return $this->db->prepare($sql)->execute([$hashBlockchain, $txHash, $id]);
    }

    /**
     * Récupère les documents d'un bien par type.
     */
    public function getDocumentsByType(int $propertyId, string $type): array
    {
        $sql = "SELECT * FROM {$this->table} WHERE property_id = ? AND type = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$propertyId, $type]);
        return $stmt->fetchAll();
    }
}
