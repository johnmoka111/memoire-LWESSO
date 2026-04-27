<?php

declare(strict_types=1);

require_once __DIR__ . '/../public/index.php'; // Charge l'autoloader et la config

use Web3\Web3;
use Web3\Contract;
use App\Services\MailService;
use App\Models\Transaction;
use App\Models\User;

/**
 * Script de surveillance Blockchain (Worker).
 * À lancer via cron : * * * * * php backend/bin/blockchain_watcher.php
 */

$web3 = new Web3(ETH_RPC_URL);
$eth = $web3->eth;

// ABI simplifié pour les événements (doit être complet en prod)
$abi = '[{"anonymous":false,"inputs":[{"indexed":true,"name":"escrowId","type":"uint256"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"seller","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"EscrowCreated","type":"event"}]';

$contract = new Contract($eth->provider, $abi);

echo "Démarrage du watcher KivuMarket+...\n";

// En production, on stockerait le "last_block_seen" en DB
$eth->blockNumber(function ($err, $blockNumber) use ($contract, $eth) {
    if ($err !== null) return;
    
    $fromBlock = '0x' . dechex($blockNumber->toString() - 100); // 100 derniers blocs

    $contract->at(CONTRACT_ADDRESS)->getEvents('EscrowCreated', [
        'fromBlock' => $fromBlock
    ], function ($err, $events) {
        if ($err !== null) return;

        foreach ($events as $event) {
            $data = $event->data;
            $escrowId = (int) $data['escrowId'];
            $buyerAddr = $data['buyer'];

            echo "Nouvel Escrow détecté : ID {$escrowId}\n";

            // 1. Trouver l'utilisateur par son wallet_address
            $userModel = new User();
            // (Il faudrait ajouter une méthode findByWallet dans le modèle User)
            
            // 2. Envoyer un email de confirmation
            // MailService::send(...);
        }
    });
});
