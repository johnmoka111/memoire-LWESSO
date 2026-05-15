<?php
define('ROOT_PATH', __DIR__ . '/backend');
require_once ROOT_PATH . '/app/Core/Database.php';

try {
    $db = App\Core\Database::getInstance();
    $db->query("UPDATE properties SET panorama_url = 'https://pannellum.org/images/alma.jpg' WHERE id IN (1,2)");
    echo "DB Updated successfully!";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
