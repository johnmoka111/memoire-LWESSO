<?php
define('ROOT_PATH', __DIR__ . '/backend');
require_once ROOT_PATH . '/app/Core/Database.php';

try {
    $db = App\Core\Database::getInstance();
    
    // Ajout des colonnes chambres et sdb
    $db->query("ALTER TABLE properties ADD COLUMN chambres INT DEFAULT 0 AFTER superficie");
    $db->query("ALTER TABLE properties ADD COLUMN sdb INT DEFAULT 0 AFTER chambres");
    
    echo "Database updated: Added 'chambres' and 'sdb' columns.";
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Columns already exist.";
    } else {
        echo "ERROR: " . $e->getMessage();
    }
}
