<?php
define('ROOT_PATH', __DIR__ . '/backend');

// Autoloader
spl_autoload_register(function (string $class): void {
    $file = ROOT_PATH . '/app/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

require_once ROOT_PATH . '/vendor/autoload.php';
require_once ROOT_PATH . '/config/app.php';

use App\Core\Database;

try {
    $db = Database::getInstance();
    
    echo "Ajout des colonnes de juridiction à la table users...\n";
    
    // On utilise une approche plus compatible pour MySQL < 8.0.19 (IF NOT EXISTS sur ALTER n'est pas toujours supporté)
    // Mais ici on tente le coup direct
    try {
        $db->exec("ALTER TABLE users ADD COLUMN province VARCHAR(100) NULL AFTER role");
        echo " - Colonne 'province' ajoutée.\n";
    } catch (Exception $e) {}

    try {
        $db->exec("ALTER TABLE users ADD COLUMN ville VARCHAR(100) NULL AFTER province");
        echo " - Colonne 'ville' ajoutée.\n";
    } catch (Exception $e) {}

    try {
        $db->exec("ALTER TABLE users ADD COLUMN commune VARCHAR(100) NULL AFTER ville");
        echo " - Colonne 'commune' ajoutée.\n";
    } catch (Exception $e) {}
    
    echo "Migration terminée !\n";
} catch (Exception $e) {
    echo "Erreur critique : " . $e->getMessage() . "\n";
}
