<?php

declare(strict_types=1);

namespace App\Services;

final class EthPriceService
{
    private const FALLBACK_USD_RATE = 1900.00;

    public static function usdRate(): float
    {
        $directory = ROOT_PATH . '/storage/cache';
        $file = $directory . '/eth_usd.json';
        if (is_file($file)) {
            $cached = json_decode((string) file_get_contents($file), true);
            if (is_array($cached) && isset($cached['rate']) && time() - (int) ($cached['updated_at'] ?? 0) < 900) return (float) $cached['rate'];
        }

        $context = stream_context_create(['http' => ['timeout' => 3], 'https' => ['timeout' => 3]]);
        $response = @file_get_contents('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', false, $context);
        $rate = $response ? (float) (json_decode($response, true)['ethereum']['usd'] ?? 0) : 0;
        if ($rate > 0) {
            if (!is_dir($directory)) @mkdir($directory, 0775, true);
            @file_put_contents($file, json_encode(['rate' => $rate, 'updated_at' => time()]));
            return $rate;
        }

        if (isset($cached['rate']) && (float) $cached['rate'] > 0) return (float) $cached['rate'];
        return self::FALLBACK_USD_RATE;
    }

    public static function toUsd(float|string $eth): float
    {
        return round((float) $eth * self::usdRate(), 2);
    }

    public static function toEth(float|string $usd): float
    {
        $rate = self::usdRate();
        return $rate > 0 ? round((float) $usd / $rate, 8) : 0.0;
    }
}
