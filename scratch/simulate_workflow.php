<?php
/**
 * Script de simulation du workflow complet KivuMarket+ pour la soutenance
 * 1. Validation terrain agent (property_id=2 => villa a bukavu)
 * 2. Création d'une transaction escrow simulée (acheteur willy ngoma, id=13)
 */

$pdo = new PDO('mysql:host=localhost;dbname=kivumarket;charset=utf8', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// --- ÉTAPE 1 : Agent valide 'villa a bukavu' (property_id=2, agent_id=12 = lucien amani) ---
echo "=== ÉTAPE 1 : Validation Terrain ===\n";

$panorama = 'https://pannellum.org/images/alma.jpg';
$propertyId = 2;
$agentId = 12;

$stmt = $pdo->prepare("UPDATE properties SET statut='valide', panorama_url=?, agent_id=? WHERE id=?");
$stmt->execute([$panorama, $agentId, $propertyId]);
echo "✅ Property #$propertyId 'villa a bukavu' marquée comme 'valide'.\n";

// Simuler l'ancrage blockchain (hash fictif pour la démo)
$docStmt = $pdo->prepare("SELECT * FROM documents WHERE property_id=? AND type='titre_foncier' LIMIT 1");
$docStmt->execute([$propertyId]);
$doc = $docStmt->fetch(PDO::FETCH_ASSOC);

if ($doc) {
    $fakeTxHash = '0x' . hash('sha256', $doc['sha256_hash'] . time());
    $fakeBlockchainHash = '0x' . $doc['sha256_hash'];
    
    $updateDoc = $pdo->prepare("UPDATE documents SET hash_blockchain=?, tx_hash=?, anchored_at=NOW() WHERE id=?");
    $updateDoc->execute([$fakeBlockchainHash, $fakeTxHash, $doc['id']]);
    echo "✅ Document #{$doc['id']} ancré sur la blockchain (tx simulée: $fakeTxHash)\n";
} else {
    echo "⚠️  Aucun titre foncier trouvé pour cette propriété.\n";
}

// --- ÉTAPE 2 : Acheteur crée une transaction escrow sur 'villa a kindu' (property_id=1) ---
echo "\n=== ÉTAPE 2 : Création Transaction Escrow ===\n";

$buyerPropertyId = 1; // villa a kindu (statut=assigne, sera validée lors de la démo)
// D'abord valider property #1 aussi
$stmt2 = $pdo->prepare("UPDATE properties SET statut='valide', panorama_url=? WHERE id=?");
$stmt2->execute(['https://pannellum.org/images/alma.jpg', $buyerPropertyId]);
echo "✅ Property #$buyerPropertyId 'villa a kindu' marquée comme 'valide'.\n";

// Création transaction escrow
$acheteurId = 13;   // willy ngoma
$agentEscrowId = 4; // John Moka

$escrowId = rand(10000, 99999);
$contractAddress = '0x' . bin2hex(random_bytes(20));
$montantEth = 0.005;
$montantUsd = 12000.00;

$insertTx = $pdo->prepare("
    INSERT INTO transactions 
    (property_id, acheteur_id, agent_id, escrow_id, contract_address, montant_eth, montant_usd, etat, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'cree', NOW())
");
$insertTx->execute([
    $buyerPropertyId,
    $acheteurId,
    $agentEscrowId,
    $escrowId,
    $contractAddress,
    $montantEth,
    $montantUsd
]);
$txId = $pdo->lastInsertId();
echo "✅ Transaction escrow #$txId créée.\n";
echo "   - Acheteur: willy ngoma (id=$acheteurId)\n";
echo "   - Bien: villa a kindu (property_id=$buyerPropertyId)\n";
echo "   - Montant: $montantEth ETH / \$$montantUsd USD\n";
echo "   - Escrow ID: $escrowId\n";
echo "   - Contrat: $contractAddress\n";
echo "   - Statut: cree\n";

// --- RÉSUMÉ FINAL ---
echo "\n=== RÉSUMÉ BASE DE DONNÉES ===\n";
$props = $pdo->query("SELECT id, titre, statut, agent_id FROM properties")->fetchAll(PDO::FETCH_ASSOC);
foreach ($props as $p) {
    echo "  Bien #{$p['id']}: {$p['titre']} => statut={$p['statut']}, agent_id={$p['agent_id']}\n";
}

$txs = $pdo->query("SELECT id, property_id, acheteur_id, montant_usd, etat FROM transactions")->fetchAll(PDO::FETCH_ASSOC);
echo "\nTransactions:\n";
foreach ($txs as $t) {
    echo "  TX #{$t['id']}: property_id={$t['property_id']}, acheteur_id={$t['acheteur_id']}, {$t['montant_usd']} USD, statut={$t['etat']}\n";
}

echo "\n✅ Simulation terminée. La plateforme est prête pour la soutenance.\n";
