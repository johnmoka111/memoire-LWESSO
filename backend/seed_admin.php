<?php
define('ROOT_PATH', __DIR__);
require_once ROOT_PATH . '/vendor/autoload.php';
require_once ROOT_PATH . '/config/app.php';

// Custom autoloader
spl_autoload_register(function (string $class): void {
    $file = ROOT_PATH . '/app/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Models\User;

$userModel = new User();
$email = 'admin@kivuimmobilier.cd';
$password = 'Admin@Kivu2026!';

$user = $userModel->findByEmail($email);

if ($user) {
    echo "Updating existing admin user password...\n";
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt = $userModel->db()->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->execute([$hashedPassword, $email]);
    echo "Password updated successfully.\n";
} else {
    echo "Creating admin user...\n";
    $userModel->create([
        'nom' => 'Immobilier',
        'prenom' => 'Admin',
        'email' => $email,
        'password' => $password,
        'role' => 'admin',
        'wallet_address' => '0x0000000000000000000000000000000000000000',
        'province' => 'Sud-Kivu',
        'ville' => 'Bukavu',
        'commune' => 'Ibanda'
    ]);
    echo "Admin user created successfully.\n";
}
