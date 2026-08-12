<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivu_immobilier', 'root', '');
    $pdo->exec("ALTER TABLE users MODIFY avatar_url LONGTEXT");
    echo "Database updated: avatar_url is now LONGTEXT";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
