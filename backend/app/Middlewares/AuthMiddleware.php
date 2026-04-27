<?php

declare(strict_types=1);

namespace App\Middlewares;

use App\Core\Request;
use App\Core\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

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
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            // On injecte les données de l'utilisateur dans la requête
            $request->user = (array) $decoded->data;
        } catch (Exception $e) {
            Response::error('Token invalide ou expiré.', 401);
        }
    }
}
