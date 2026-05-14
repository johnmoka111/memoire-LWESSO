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
        $authHeader = $request->header('Authorization', '');
        $token = null;

        // Extraction du jeton via regex (plus fiable)
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        if (!$token) {
            Response::error('Token manquant ou format invalide. Authentification requise.', 401);
        }

        try {
            // Utilisation du Secret défini dans config/app.php
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            
            // On injecte les données de l'utilisateur dans la requête
            $request->user = (array) $decoded->data;
        } catch (Exception $e) {
            Response::error('Signature du token invalide : ' . $e->getMessage() . ' (Verify Secret Length: ' . strlen(JWT_SECRET) . ')', 401);
        }
    }
}
