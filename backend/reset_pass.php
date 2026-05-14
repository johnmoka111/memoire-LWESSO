<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivumarket', 'root', '');
    $pass = password_hash('Agent@Kivu2026!', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = 'johnmoka2024@gmail.com'");
    $stmt->execute([$pass]);
    echo "Password reset successful for johnmoka2024@gmail.com";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
