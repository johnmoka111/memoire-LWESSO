<?php
define('ROOT_PATH', __DIR__ . '/../backend');
require_once ROOT_PATH . '/app/Core/Database.php';

try {
    $db = App\Core\Database::getInstance();
    $stmt = $db->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "COLUMNS IN 'users' TABLE:\n";
    foreach ($columns as $col) {
        echo "- " . $col['Field'] . " (" . $col['Type'] . ")\n";
    }
    
    $stmt = $db->query("SELECT COUNT(*) FROM properties");
    echo "\nTOTAL PROPERTIES IN DB: " . $stmt->fetchColumn() . "\n";

    $stmt = $db->query("SELECT * FROM properties LIMIT 1");
    $prop = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($prop) {
        echo "\nSAMPLE PROPERTY DATA:\n";
        print_r($prop);
    } else {
        echo "\nNO PROPERTIES FOUND IN TABLE 'properties'\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
