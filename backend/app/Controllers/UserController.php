<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\User;

/**
 * Contrôleur pour la gestion du profil utilisateur.
 */
final class UserController extends Controller
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    /**
     * Met à jour le profil de l'utilisateur connecté.
     */
    public function updateProfile(Request $request): void
    {
        // Récupérer l'ID depuis le token (injecté par le middleware Auth)
        $userId = $request->userId; 

        if (!$userId) {
            Response::error('Non autorisé', 401);
        }

        $data = $request->all();
        
        // Nettoyage des données
        $updateData = [
            'nom' => $data['nom'] ?? null,
            'prenom' => $data['prenom'] ?? null,
            'telephone' => $data['telephone'] ?? null,
            'avatar_url' => $data['avatar_url'] ?? null,
            'province' => $data['province'] ?? null,
            'ville' => $data['ville'] ?? null,
            'commune' => $data['commune'] ?? null
        ];

        // Retirer les valeurs nulles pour ne pas écraser les données existantes
        $updateData = array_filter($updateData, fn($v) => !is_null($v));

        if ($this->userModel->update((int)$userId, $updateData)) {
            // Récupérer les nouvelles infos pour renvoyer au front
            $updatedUser = $this->userModel->find((int)$userId);
            
            Response::success([
                'user' => [
                    'id' => $updatedUser['id'],
                    'nom' => $updatedUser['nom'],
                    'prenom' => $updatedUser['prenom'],
                    'telephone' => $updatedUser['telephone'],
                    'avatar_url' => $updatedUser['avatar_url'],
                    'role' => $updatedUser['role'],
                    'email' => $updatedUser['email']
                ]
            ], 'Profil mis à jour avec succès');
        } else {
            Response::error('Erreur lors de la mise à jour');
        }
    }
}
