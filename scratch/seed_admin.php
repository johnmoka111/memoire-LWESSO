<?php
/**
 * Script d'initialisation du compte administrateur.
 * À exécuter UNE SEULE FOIS après l'import du schema.sql
 * 
 * Usage: C:\xampp\php\php.exe scratch\seed_admin.php
 */

try {
    $pdo = new PDO('mysql:host=localhost;dbname=kivumarket;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $email = 'admin@kivumarket.cd';
    $password = password_hash('Admin@Kivu2026!', PASSWORD_BCRYPT);
    $nom = 'Admin';
    $prenom = 'KivuMarket';
    $role = 'admin';

    // Vérifier si l'admin existe déjà
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    $existing = $check->fetch();

    if ($existing) {
        // Mettre à jour le mot de passe si existe déjà
        $stmt = $pdo->prepare("UPDATE users SET password = ?, nom = ?, prenom = ?, role = ? WHERE email = ?");
        $stmt->execute([$password, $nom, $prenom, $role, $email]);
        echo "✅ Compte admin mis à jour.\n";
    } else {
        // Créer le compte
        $stmt = $pdo->prepare("INSERT INTO users (nom, prenom, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$nom, $prenom, $email, $password, $role]);
        echo "✅ Compte admin créé avec succès.\n";
    }

    echo "   Email    : admin@kivumarket.cd\n";
    echo "   Mot de passe : Admin@Kivu2026!\n";
    echo "\n⚠️  Changez ce mot de passe en production !\n";

} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
    echo "   Vérifiez que XAMPP MySQL est démarré et que la base 'kivumarket' existe.\n";
}
