<?php
define('ROOT_PATH', __DIR__ . '/backend');
require_once ROOT_PATH . '/config/app.php';
echo "JWT_SECRET: " . JWT_SECRET . "\n";
echo "Length: " . strlen(JWT_SECRET) . "\n";
