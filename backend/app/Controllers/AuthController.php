<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\User;
use App\Services\MailService;
use Firebase\JWT\JWT;

/**
 * Contrôleur pour l'authentification.
 */
final class AuthController extends Controller
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    /**
     * Inscription d'un nouvel utilisateur.
     */
    public function register(Request $request): void
    {
        $errors = $request->validate([
            'nom' => 'required|max:100',
            'prenom' => 'required|max:100',
            'email' => 'required|email',
            'password' => 'required|max:255'
        ]);

        if (!empty($errors)) {
            Response::error('Données invalides', 422, $errors);
        }

        if ($this->userModel->findByEmail($request->input('email'))) {
            Response::error('Cet email est déjà utilisé', 409);
        }

        $userId = $this->userModel->create($request->all());

        // Notification Email (spécifié dans am.md)
        MailService::send(
            $request->input('email'),
            "Bienvenue sur KivuMobilier",
            "<h1>Bonjour " . $request->input('prenom') . "</h1><p>Votre compte a été créé avec succès. Vous pouvez maintenant sécuriser vos transactions foncières à Bukavu.</p>",
            'registration',
            $userId
        );

        Response::success(['user_id' => $userId], 'Inscription réussie et email de bienvenue envoyé');
    }

    /**
     * Connexion et génération du token JWT.
     */
    public function login(Request $request): void
    {
        $email = $request->input('email');
        $password = $request->input('password');

        if (!$email || !$password) {
            Response::error('Email et mot de passe requis', 400);
        }

        $user = $this->userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            Response::error('Identifiants invalides', 401);
        }

        // Payload du JWT
        $payload = [
            'iat'  => time(),
            'exp'  => time() + JWT_EXPIRE,
            'data' => [
                'id'    => $user['id'],
                'email' => $user['email'],
                'role'  => $user['role'],
                'wallet' => $user['wallet_address']
            ]
        ];

        $jwt = JWT::encode($payload, JWT_SECRET, 'HS256');

        Response::success([
            'token' => $jwt,
            'user' => [
                'id' => $user['id'],
                'nom' => $user['nom'],
                'prenom' => $user['prenom'],
                'email' => $user['email'],
                'role' => $user['role'],
                'telephone' => $user['telephone'] ?? '',
                'avatar_url' => $user['avatar_url'] ?? null,
                'province' => $user['province'] ?? '',
                'ville' => $user['ville'] ?? '',
                'commune' => $user['commune'] ?? '',
                'wallet_address' => $user['wallet_address'] ?? null
            ]
        ], 'Connexion réussie');
    }
}
