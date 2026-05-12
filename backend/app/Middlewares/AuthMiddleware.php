<?php

declare(strict_types=1);

namespace App\Middlewares;

use App\Core\Request;
use App\Core\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

// Marge de tolérance pour le décalage horaire (secondes)
JWT::$leeway = 60;

/**
 * Vérifie si l'utilisateur est authentifié via un token JWT.
 */
final class AuthMiddleware
{
    public function handle(Request $request): void
    {
        $token = $request->bearerToken();

        if (!$token) {
            Response::error('Token manquant. Authentification requise.', 401);
        }

        try {
            // TEST HARDCODE SECRET
            $hardcoded_secret = 'kivu_market_ultra_secure_secret_key_2026_bukavu_rdc_security_first';
            $decoded = JWT::decode($token, new Key($hardcoded_secret, 'HS256'));
            // On injecte les données de l'utilisateur dans la requête
            $request->user = (array) $decoded->data;
        } catch (Exception $e) {
            Response::error('Token invalide ou expiré : ' . $e->getMessage() . ' (Secret Length: ' . strlen(JWT_SECRET) . ')', 401);
        }
    }
}
