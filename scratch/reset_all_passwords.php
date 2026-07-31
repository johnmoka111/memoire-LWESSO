<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivumarket', 'root', '');
    
    // Reset agent johnfrederickbkm@gmail.com password
    $passAgent = password_hash('Agent@Kivu2026!', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = 'johnfrederickbkm@gmail.com'");
    $stmt->execute([$passAgent]);
    echo "Password reset for johnfrederickbkm@gmail.com\n";

    // Reset agent johnmoka2024@gmail.com password
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = 'johnmoka2024@gmail.com'");
    $stmt->execute([$passAgent]);
    echo "Password reset for johnmoka2024@gmail.com\n";

    // Reset buyer luciusamani@gmail.com password
    $passBuyer = password_hash('Buyer@Kivu2026!', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = 'luciusamani@gmail.com'");
    $stmt->execute([$passBuyer]);
    echo "Password reset for luciusamani@gmail.com\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
