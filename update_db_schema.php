<?php
define('ROOT_PATH', __DIR__ . '/backend');
require_once ROOT_PATH . '/app/Core/Database.php';

try {
    $db = App\Core\Database::getInstance();
    
    // Ajout de la colonne description
    $db->query("ALTER TABLE documents ADD COLUMN description VARCHAR(255) NULL AFTER type");
    
    // Modification de la table properties pour latitude/longitude en DECIMAL pour plus de précision si nécessaire
    // (Ils sont déjà probablement là mais je vérifie)
    
    echo "Database updated successfully!";
} catch (Exception $e) {
    // Si la colonne existe déjà, on ignore l'erreur
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column already exists.";
    } else {
        echo "ERROR: " . $e->getMessage();
    }
}
