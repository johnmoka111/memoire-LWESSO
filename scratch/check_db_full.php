<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivumarket', 'root', '');
    
    echo "=== USERS ===\n";
    $stmt = $pdo->query("SELECT id, nom, prenom, email, role, wallet_address FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($users);
    
    echo "\n=== PROPERTIES ===\n";
    $stmt = $pdo->query("SELECT id, owner_id, agent_id, titre, prix, prix_usd, commune, quartier, latitude, longitude, superficie, type_bien, statut FROM properties");
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($properties);
    
    echo "\n=== DOCUMENTS ===\n";
    $stmt = $pdo->query("SELECT id, property_id, uploaded_by, type, nom_fichier, file_url, sha256_hash, hash_blockchain, tx_hash FROM documents");
    $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($documents);
    
    echo "\n=== TRANSACTIONS ===\n";
    $stmt = $pdo->query("SELECT id, property_id, acheteur_id, agent_id, admin_id, escrow_id, contract_address, montant_eth, etat FROM transactions");
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($transactions);

    echo "\n=== NOTIFICATIONS ===\n";
    $stmt = $pdo->query("SELECT id, user_id, to_email, sujet, type, statut, tentatives, erreur_msg FROM notifications");
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($notifications);

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
