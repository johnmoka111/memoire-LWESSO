<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivu_immobilier', 'root', '');
    $stmt = $pdo->query("SELECT email, password, prenom FROM users WHERE role = 'agent'");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
