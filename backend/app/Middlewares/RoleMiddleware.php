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
    public function handle(Request $request, string $rolesString): void
    {
        if (!$request->user) {
            Response::error("Utilisateur non authentifié.", 401);
        }

        $allowedRoles = explode(',', $rolesString);
        $userRole = $request->user['role'];

        // L'admin et le superadmin ont généralement tous les droits par défaut ici
        if (in_array($userRole, $allowedRoles) || $userRole === 'admin' || $userRole === 'superadmin') {
            return;
        }

        Response::error("Accès refusé. Rôles autorisés : {$rolesString}", 403);
    }
}
