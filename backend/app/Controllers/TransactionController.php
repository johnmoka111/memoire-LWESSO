<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\Transaction;
use App\Models\User;
use App\Services\BlockchainService;
use App\Services\MailService;

/**
 * Contrôleur pour les transactions d'escrow blockchain.
 */
final class TransactionController extends Controller
{
    private Transaction $transactionModel;

    public function __construct()
    {
        $this->transactionModel = new Transaction();
    }

    /**
     * Liste les transactions de l'utilisateur.
     */
    public function index(Request $request): void
    {
        $userId = $request->user['id'];
        $role = $request->user['role'];

        $sql = "SELECT t.*, p.titre as property_title 
                FROM transactions t 
                JOIN properties p ON t.property_id = p.id";
        
        if ($role === 'acheteur') {
            $sql .= " WHERE t.acheteur_id = ?";
        } elseif ($role === 'proprietaire') {
            $sql .= " WHERE p.owner_id = ?";
        }
        
        $stmt = \App\Core\Database::getInstance()->prepare($sql);
        $stmt->execute([$userId]);
        Response::success($stmt->fetchAll());
    }

    /**
     * Enregistre une nouvelle transaction après le dépôt MetaMask.
     */
    public function store(Request $request): void
    {
        $errors = $request->validate([
            'property_id' => 'required|numeric',
            'escrow_id' => 'required',
            'montant_eth' => 'required',
            'tx_creation' => 'required'
        ]);

        if (!empty($errors)) {
            Response::error('Données de transaction invalides', 422, $errors);
        }

        $id = $this->transactionModel->createEscrow([
            'property_id' => $request->input('property_id'),
            'acheteur_id' => $request->user['id'],
            'escrow_id' => $request->input('escrow_id'),
            'contract_address' => CONTRACT_ADDRESS,
            'montant_eth' => $request->input('montant_eth'),
            'tx_creation' => $request->input('tx_creation')
        ]);

        Response::success(['id' => $id], 'Transaction enregistrée dans le système');
    }

    /**
     * Résolution de litige par l'Administrateur (Arbitrage).
     */
    public function resolve(Request $request): void
    {
        $id = (int)$request->input('transaction_id');
        $decision = $request->input('decision'); // 'libere' (vendeur) ou 'rembourse' (acheteur)
        $reason = $request->input('reason', 'Arbitrage administratif KivuMarket+');

        if (!$id || !in_array($decision, ['libere', 'rembourse'])) {
            Response::error('ID transaction et décision (libere/rembourse) requis', 400);
        }

        // 1. Récupérer les détails de la transaction et des utilisateurs
        $db = \App\Core\Database::getInstance();
        $sql = "SELECT t.*, b.email as buyer_email, b.prenom as buyer_name, s.email as seller_email, s.prenom as seller_name 
                FROM transactions t 
                JOIN users b ON t.acheteur_id = b.id
                JOIN properties p ON t.property_id = p.id
                JOIN users s ON p.owner_id = s.id
                WHERE t.id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $txData = $stmt->fetch();

        if (!$txData) {
            Response::error('Transaction introuvable', 404);
        }

        // 2. Appel à la Blockchain (Phase 6)
        $blockchain = new BlockchainService();
        $releaseToSeller = ($decision === 'libere');
        $txHash = $blockchain->adminResolve((int)$txData['escrow_id'], $releaseToSeller, $reason);

        if (!$txHash) {
            Response::error('Erreur lors de la transaction blockchain. Arbitrage échoué.', 500);
        }

        // 3. Mise à jour de la base de données
        $this->transactionModel->updateStatus($id, $decision, $txHash);
        
        // 4. Notifications Emails
        // Au vendeur
        MailService::send(
            $txData['seller_email'],
            "Décision d'arbitrage - KivuMarket+",
            "<h1>Arbitrage rendu</h1><p>Bonjour {$txData['seller_name']}, l'administrateur a tranché : <strong>{$decision}</strong>. Motif : {$reason}</p>",
            'dispute_resolution'
        );

        // À l'acheteur
        MailService::send(
            $txData['buyer_email'],
            "Décision d'arbitrage - KivuMarket+",
            "<h1>Arbitrage rendu</h1><p>Bonjour {$txData['buyer_name']}, l'administrateur a tranché : <strong>{$decision}</strong>. Motif : {$reason}</p>",
            'dispute_resolution'
        );

        Response::success(['tx_hash' => $txHash], "Litige résolu avec succès. Décision : {$decision}.");
    }
}
