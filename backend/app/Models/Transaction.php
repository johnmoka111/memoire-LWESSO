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
        $this->db->beginTransaction();
        try {
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
            $id = (int) $this->db->lastInsertId();

            // Mettre à jour le statut du bien
            $sqlProp = "UPDATE properties SET statut = 'vendu' WHERE id = ?";
            $this->db->prepare($sqlProp)->execute([$data['property_id']]);

            $this->db->commit();
            return $id;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
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
