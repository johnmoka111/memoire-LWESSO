<?php

declare(strict_types=1);

// ─── Application ─────────────────────────────────────────────────────────────
define('APP_NAME',    'KivuMarket+');
define('APP_VERSION', '1.0.0');
define('APP_ENV',     getenv('APP_ENV') ?: 'development');
define('APP_URL',     getenv('APP_URL')  ?: 'http://localhost:8080');

// ─── JWT ─────────────────────────────────────────────────────────────────────
define('JWT_SECRET',  getenv('JWT_SECRET')  ?: 'kivu_market_secret_key_2026');
define('JWT_EXPIRE',  (int)(getenv('JWT_EXPIRE') ?: 3600 * 24 * 7)); // 7 jours

// ─── PHPMailer / SMTP (Gmail) ────────────────────────────────────────────────
define('MAIL_HOST',     getenv('MAIL_HOST')     ?: 'smtp.gmail.com');
define('MAIL_PORT',     (int)(getenv('MAIL_PORT') ?: 587));
define('MAIL_USERNAME', getenv('MAIL_USERNAME') ?: '');
define('MAIL_PASSWORD', getenv('MAIL_PASSWORD') ?: '');
define('MAIL_FROM',     getenv('MAIL_FROM')     ?: 'noreply@kivumarket.com');
define('MAIL_FROM_NAME',getenv('MAIL_FROM_NAME') ?: 'KivuMarket');

// ─── Google Cloud Storage ─────────────────────────────────────────────────────
define('GCS_BUCKET',      getenv('GCS_BUCKET')      ?: 'kivumarket-files');
define('GCS_PROJECT',     getenv('GCS_PROJECT')     ?: 'kivu-market-project');
define('GCS_CREDENTIALS', getenv('GCS_CREDENTIALS') ?: ROOT_PATH . '/config/gcs-key.json');

// ─── Blockchain (Sepolia testnet → Ethereum mainnet) ─────────────────────────
define('ETH_RPC_URL',      getenv('ETH_RPC_URL')      ?: 'https://testnet-rpc.gochain.io');
define('CONTRACT_ADDRESS', getenv('CONTRACT_ADDRESS') ?: '');
define('ADMIN_WALLET',     getenv('ADMIN_WALLET')     ?: '');
define('ADMIN_PRIVATE_KEY',getenv('ADMIN_PRIVATE_KEY') ?: '');

// ─── CoinGecko (oracle prix ETH → USD → CDF) ─────────────────────────────────
define('COINGECKO_API', 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,cdf');
define('CDF_RATE_FALLBACK', 2800); // Taux CDF/USD de secours si API indisponible

// ─── Upload & Fichiers ────────────────────────────────────────────────────────
define('UPLOAD_MAX_MB',   10);
define('UPLOAD_ALLOWED',  ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
define('STORAGE_PATH',    ROOT_PATH . '/storage/uploads/');
define('PANORAMA_QUALITY', 80); // Compression JPEG pour panoramas 360° (< 2 Mo)
