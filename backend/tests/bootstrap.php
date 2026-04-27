<?php

declare(strict_types=1);

define('ROOT_PATH', dirname(__DIR__));

// Autoloader maison
spl_autoload_register(function (string $class): void {
    $file = ROOT_PATH . '/app/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

require_once ROOT_PATH . '/vendor/autoload.php';
require_once ROOT_PATH . '/config/app.php';

// On s'assure que certaines variables $_SERVER sont définies pour éviter les warnings
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/';
