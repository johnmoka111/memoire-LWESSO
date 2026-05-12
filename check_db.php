<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivumarket', 'root', '');
    $stmt = $pdo->query("SELECT email, role FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
