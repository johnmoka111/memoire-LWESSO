<?php
define('ROOT_PATH', __DIR__ . '/backend');
require_once ROOT_PATH . '/app/Core/Database.php';

try {
    $db = App\Core\Database::getInstance();
    
    // Check properties
    echo "--- PROPERTIES ---\n";
    $stmt = $db->query("SELECT id, titre, panorama_url FROM properties");
    $props = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($props);

    // Check documents (photos)
    echo "\n--- DOCUMENTS (PHOTOS) ---\n";
    $stmt = $db->query("SELECT id, property_id, type, file_url FROM documents WHERE type = 'photo'");
    $docs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($docs);
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
