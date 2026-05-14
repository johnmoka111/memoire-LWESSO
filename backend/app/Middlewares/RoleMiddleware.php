<?php

declare(strict_types=1);

namespace App\Middlewares;

use App\Core\Request;
use App\Core\Response;

/**
 * Vérifie si l'utilisateur possède le rôle requis.
 * Doit être exécuté APRES AuthMiddleware.
 */
final class RoleMiddleware
{
    public function handle(Request $request, string $role): void
    {
        // L'administrateur a tous les droits
        if (!$request->user || ($request->user['role'] !== $role && $request->user['role'] !== 'admin')) {
            Response::error("Accès refusé. Rôle '{$role}' requis.", 403);
        }
    }
}
