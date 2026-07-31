<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/kivumarket/backend/public/index.php/api/properties");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

echo "HTTP Code: " . $info['http_code'] . "\n\n";
echo "Response:\n" . $response . "\n";
