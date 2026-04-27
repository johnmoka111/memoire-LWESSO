<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Model;

/**
 * Modèle pour la table transactions (Escrow).
 */
final class Transaction extends Model
{
    protected string $table = 'transactions';

    /**
     * Crée une transaction d'escrow (après signature MetaMask).
     */
    public function createEscrow(array $data): int
    {
        $sql = "INSERT INTO {$this->table} 
                (property_id, acheteur_id, escrow_id, contract_address, montant_eth, tx_creation, etat) 
                VALUES (?, ?, ?, ?, ?, ?, 'cree')";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['property_id'],
            $data['acheteur_id'],
            $data['escrow_id'],
            $data['contract_address'],
            $data['montant_eth'],
            $data['tx_creation']
        ]);
        return (int) $this->db->lastInsertId();
    }

    /**
     * Met à jour l'état de la transaction (libération, arbitrage, etc.).
     */
    public function updateStatus(int $id, string $etat, ?string $txHash = null): bool
    {
        $sql = "UPDATE {$this->table} SET etat = ?, updated_at = NOW()";
        $params = [$etat];

        if ($txHash) {
            $sql .= ", tx_liberation = ?";
            $params[] = $txHash;
        }

        $sql .= " WHERE id = ?";
        $params[] = $id;

        return $this->db->prepare($sql)->execute($params);
    }
}
