<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivumarket', 'root', '');
    
    // Ajouter la colonne is_active si elle n'existe pas
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active TINYINT(1) DEFAULT 1");
    
    echo "Database updated: is_active column added/verified.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
