<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivu_immobilier', 'root', '');
    $stmt = $pdo->query("SELECT email, avatar_url FROM users WHERE role = 'agent'");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $res) {
        echo "Email: " . $res['email'] . "\n";
        echo "Avatar URL Length: " . strlen($res['avatar_url'] ?? '') . "\n";
        echo "Avatar Preview: " . substr($res['avatar_url'] ?? '', 0, 50) . "...\n\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
