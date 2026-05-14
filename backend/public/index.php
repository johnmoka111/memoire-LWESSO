<?php
declare(strict_types=1);

// Headers CORS (Optimisés pour React + JWT)
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Gestion du Preflight CORS
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

define('ROOT_PATH', dirname(__DIR__));

// Forcer les limites PHP
ini_set('upload_max_filesize', '50M');
ini_set('post_max_size', '60M');
ini_set('max_execution_time', '600');
ini_set('memory_limit', '256M');

// Debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Autoloader maison
spl_autoload_register(function (string $class): void {
    $file = ROOT_PATH . '/app/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

require_once ROOT_PATH . '/vendor/autoload.php';
require_once ROOT_PATH . '/config/app.php';

// Header JSON
header('Content-Type: application/json; charset=utf-8');

// Récupération méthode + chemin
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri    = urldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
$uri    = rtrim($uri, '/');

// Correction pour les sous-répertoires (XAMPP)
if (strpos($uri, '/api') !== false) {
    $uri = substr($uri, strpos($uri, '/api'));
}

// Dispatch des routes
require_once ROOT_PATH . '/routes/api.php';
