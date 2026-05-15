<?php
require_once __DIR__ . '/backend/app/Core/Database.php';
define('ROOT_PATH', __DIR__ . '/backend');

try {
    $db = \App\Core\Database::getInstance();
    
    $sql = "SELECT p.*, u.nom as owner_name,
                   (SELECT file_url FROM documents WHERE property_id = p.id AND type = 'photo' ORDER BY id ASC LIMIT 1) as image_url
            FROM properties p 
            LEFT JOIN users u ON p.owner_id = u.id 
            WHERE p.statut IN ('valide', 'assigne', 'en_attente')
            ORDER BY p.created_at DESC";
    
    $stmt = $db->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Nombre de biens trouvés : " . count($results) . "\n";
    foreach ($results as $r) {
        echo "- [" . $r['id'] . "] " . $r['titre'] . " (Statut: " . $r['statut'] . ")\n";
    }
} catch (Exception $e) {
    echo "Erreur SQL : " . $e->getMessage() . "\n";
}
