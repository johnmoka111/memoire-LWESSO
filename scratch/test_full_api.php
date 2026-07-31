<?php
/**
 * Test complet du workflow API pour la soutenance
 */

$base = 'http://localhost/kivumarket/backend/public/index.php/api';

function curlJson($url, $method = 'GET', $data = null, $token = null) {
    $ch = curl_init($url);
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) $headers[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'body' => json_decode($resp, true)];
}

echo "=== TEST 1 : Login Admin ===\n";
$login = curlJson("$base/auth/login", 'POST', [
    'email' => 'admin@kivumarket.cd',
    'password' => 'Admin@Kivu2026!'
]);
echo "HTTP {$login['code']}\n";
if ($login['code'] === 200) {
    $adminToken = $login['body']['data']['token'];
    echo "✅ Connexion admin OK. Token obtenu.\n";
} else {
    echo "❌ Connexion admin ECHOUÉE\n";
    print_r($login);
    exit;
}

echo "\n=== TEST 2 : Login Agent (lucien amani) ===\n";
$loginAgent = curlJson("$base/auth/login", 'POST', [
    'email' => 'johnfrederickbkm@gmail.com',
    'password' => 'Agent@Kivu2026!'
]);
echo "HTTP {$loginAgent['code']}\n";
if ($loginAgent['code'] === 200) {
    $agentToken = $loginAgent['body']['data']['token'];
    echo "✅ Connexion agent OK. Token obtenu.\n";
} else {
    echo "❌ Connexion agent ECHOUÉE\n";
}

echo "\n=== TEST 3 : Login Acheteur (willy ngoma) ===\n";
$loginBuyer = curlJson("$base/auth/login", 'POST', [
    'email' => 'luciusamani@gmail.com',
    'password' => 'Buyer@Kivu2026!'
]);
echo "HTTP {$loginBuyer['code']}\n";
if ($loginBuyer['code'] === 200) {
    $buyerToken = $loginBuyer['body']['data']['token'];
    echo "✅ Connexion acheteur OK. Token obtenu.\n";
} else {
    echo "❌ Connexion acheteur ECHOUÉE\n";
}

echo "\n=== TEST 4 : Liste des Biens Publics ===\n";
$props = curlJson("$base/properties");
echo "HTTP {$props['code']}\n";
$count = count($props['body']['data'] ?? []);
echo "✅ $count bien(s) retourné(s).\n";
foreach (($props['body']['data'] ?? []) as $p) {
    echo "  - #{$p['id']} '{$p['titre']}' statut={$p['statut']}\n";
}

echo "\n=== TEST 5 : Détail d'un bien avec documents ===\n";
$detail = curlJson("$base/properties/2");
echo "HTTP {$detail['code']}\n";
if ($detail['code'] === 200) {
    $photos = count($detail['body']['data']['photos'] ?? []);
    $titres = count($detail['body']['data']['titres_fonciers'] ?? []);
    echo "✅ Bien #2 : $photos photo(s), $titres titre(s) foncier(s).\n";
    $tf = $detail['body']['data']['titres_fonciers'][0] ?? null;
    if ($tf) {
        echo "  Blockchain hash: " . ($tf['hash_blockchain'] ?: '(non ancré)') . "\n";
        echo "  TX hash: " . ($tf['tx_hash'] ?: '(non ancré)') . "\n";
    }
}

echo "\n=== TEST 6 : Missions de l'agent ===\n";
if (isset($agentToken)) {
    $missions = curlJson("$base/agent/missions", 'GET', null, $agentToken);
    echo "HTTP {$missions['code']}\n";
    $count = count($missions['body']['data'] ?? []);
    echo ($count > 0 ? "✅" : "ℹ️") . " $count mission(s) active(s) pour l'agent.\n";
}

echo "\n=== TEST 7 : Transactions de l'acheteur ===\n";
if (isset($buyerToken)) {
    $txs = curlJson("$base/transactions", 'GET', null, $buyerToken);
    echo "HTTP {$txs['code']}\n";
    $count = count($txs['body']['data'] ?? []);
    echo "✅ $count transaction(s) trouvée(s) pour l'acheteur.\n";
    foreach (($txs['body']['data'] ?? []) as $t) {
        echo "  - TX #{$t['id']}: {$t['property_title']}, {$t['montant_usd']} USD, statut={$t['etat']}\n";
    }
}

echo "\n=== TEST 8 : Dashboard Stats Admin ===\n";
$stats = curlJson("$base/dashboard/stats", 'GET', null, $adminToken);
echo "HTTP {$stats['code']}\n";
if ($stats['code'] === 200) {
    print_r($stats['body']['data']);
}

echo "\n=== TEST 9 : Liste des Agents (Admin) ===\n";
$agents = curlJson("$base/admin/agents", 'GET', null, $adminToken);
echo "HTTP {$agents['code']}\n";
$count = count($agents['body']['data'] ?? []);
echo "✅ $count agent(s) dans le système.\n";

echo "\n✅ Tests terminés.\n";
