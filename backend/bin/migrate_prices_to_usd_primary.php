<?php

declare(strict_types=1);

// Migration unique : les anciennes annonces saisissaient déjà `prix` comme USD.
// Le nouveau modèle stocke USD dans prix_usd et le montant payable dans prix (ETH).
define('ROOT_PATH', dirname(__DIR__));
require_once ROOT_PATH . '/app/Services/EthPriceService.php';

use App\Services\EthPriceService;

$config = require ROOT_PATH . '/config/database.php';
$dsn = sprintf('%s:host=%s;port=%s;dbname=%s;charset=%s', $config['driver'], $config['host'], $config['port'], $config['database'], $config['charset']);
$db = new PDO($dsn, $config['username'], $config['password'], $config['options']);

$properties = $db->query('SELECT id, prix FROM properties WHERE (prix_usd IS NULL OR prix_usd = 0) AND prix > 0')->fetchAll();
$update = $db->prepare('UPDATE properties SET prix_usd = ?, prix = ? WHERE id = ?');
$rate = EthPriceService::usdRate();

$db->beginTransaction();
try {
    foreach ($properties as $property) {
        $usd = round((float) $property['prix'], 2);
        $update->execute([$usd, EthPriceService::toEth($usd), $property['id']]);
    }
    $db->commit();
    echo count($properties) . " annonce(s) migrée(s) au taux de " . $rate . " USD/ETH.\n";
} catch (Throwable $exception) {
    $db->rollBack();
    throw $exception;
}
