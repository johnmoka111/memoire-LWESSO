<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivu_immobilier', 'root', '');
    
    // Créer la table notifications si elle n'existe pas
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        to_email VARCHAR(255) NOT NULL,
        sujet VARCHAR(255) NOT NULL,
        corps TEXT NOT NULL,
        type VARCHAR(50),
        statut ENUM('en_attente', 'envoye', 'erreur') DEFAULT 'en_attente',
        erreur_msg TEXT,
        sent_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    echo "Table 'notifications' verified/created.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
