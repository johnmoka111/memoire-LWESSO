<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\User;
use App\Services\MailService;

/**
 * Contrôleur pour les actions administratives.
 */
final class AdminController extends Controller
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    /**
     * Crée un compte pour un Agent Foncier (Tâche 1.1 & 1.2).
     */
    public function createAgent(Request $request): void
    {
        // Validation des données
        $errors = $request->validate([
            'nom' => 'required|max:100',
            'prenom' => 'required|max:100',
            'email' => 'required|email',
            'telephone' => 'required'
        ]);

        if (!empty($errors)) {
            Response::error('Données invalides', 422, $errors);
        }

        // Vérifier si l'email existe déjà
        if ($this->userModel->findByEmail($request->input('email'))) {
            Response::error('Cet email est déjà utilisé', 409);
        }

        // Algorithme de génération de mot de passe (Tâche 1.2)
        $temporaryPassword = bin2hex(random_bytes(4)); // Génère 8 caractères aléatoires

        // Préparation des données pour le modèle
        $agentData = [
            'nom' => $request->input('nom'),
            'prenom' => $request->input('prenom'),
            'email' => $request->input('email'),
            'password' => $temporaryPassword,
            'role' => 'agent'
        ];

        // Création de l'utilisateur
        $userId = $this->userModel->create($agentData);

        // Envoi des identifiants par Email
        $subject = "Vos accès Agent Foncier - KivuMarket+";
        $message = "
            <h1>Bienvenue dans l'équipe KivuMarket+, " . $request->input('prenom') . "</h1>
            <p>Votre compte agent a été créé par l'administrateur.</p>
            <p><strong>Vos identifiants de connexion :</strong></p>
            <ul>
                <li>Email : " . $request->input('email') . "</li>
                <li>Mot de passe provisoire : <strong>" . $temporaryPassword . "</strong></li>
            </ul>
            <p>Veuillez vous connecter pour commencer la certification des biens fonciers.</p>
        ";

        MailService::send(
            $request->input('email'),
            $subject,
            $message,
            'agent_creation',
            $userId
        );

        Response::success([
            'agent_id' => $userId,
            'temporary_password' => $temporaryPassword
        ], 'Compte agent créé avec succès et identifiants envoyés par email');
    }

    /**
     * Liste tous les agents fonciers.
     */
    public function listAgents(Request $request): void
    {
        $sql = "SELECT id, nom, prenom, email, created_at FROM users WHERE role = 'agent' ORDER BY created_at DESC";
        $stmt = $this->userModel->db()->prepare($sql);
        $stmt->execute();
        $agents = $stmt->fetchAll();

        Response::success($agents);
    }
}
