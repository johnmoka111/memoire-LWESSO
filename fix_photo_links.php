<?php
define('ROOT_PATH', __DIR__ . '/backend');
require_once ROOT_PATH . '/app/Core/Database.php';

try {
    $db = App\Core\Database::getInstance();
    
    // On récupère tous les documents
    $stmt = $db->query("SELECT id, file_url FROM documents");
    $docs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $baseUrl = "http://localhost/kivu%20market/backend/storage/uploads/";
    $count = 0;
    
    foreach ($docs as $doc) {
        // Si le lien est relatif (commence par /storage)
        if (strpos($doc['file_url'], '/storage/') === 0) {
            $filename = basename($doc['file_url']);
            $newUrl = $baseUrl . $filename;
            
            $update = $db->prepare("UPDATE documents SET file_url = ? WHERE id = ?");
            $update->execute([$newUrl, $doc['id']]);
            $count++;
        }
    }
    
    echo "Successfully updated $count photo links to absolute URLs!";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
