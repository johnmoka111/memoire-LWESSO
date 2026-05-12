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
        // Validation des données enrichies
        $errors = $request->validate([
            'nom' => 'required|max:100',
            'prenom' => 'required|max:100',
            'email' => 'required|email',
            'telephone' => 'required',
            'province' => 'required',
            'ville' => 'required',
            'commune' => 'required'
        ]);

        if (!empty($errors)) {
            Response::error('Données invalides', 422, $errors);
        }

        // Vérifier si l'email existe déjà
        if ($this->userModel->findByEmail($request->input('email'))) {
            Response::error('Cet email est déjà utilisé', 409);
        }

        // Génération de mot de passe provisoire
        $temporaryPassword = bin2hex(random_bytes(4)); 

        // Préparation des données
        $agentData = [
            'nom' => $request->input('nom'),
            'prenom' => $request->input('prenom'),
            'email' => $request->input('email'),
            'password' => $temporaryPassword,
            'role' => 'agent',
            'avatar_url' => $request->input('photo_passeport'),
            'province' => $request->input('province'),
            'ville' => $request->input('ville'),
            'commune' => $request->input('commune')
        ];

        // Création de l'utilisateur
        $userId = $this->userModel->create($agentData);

        // Tentative d'envoi d'email (silencieuse pour éviter le Network Error si le SMTP est mal configuré)
        try {
            $subject = "Accès Agent KivuMarket+ — " . $request->input('commune');
            $message = "Bonjour " . $request->input('prenom') . ",\n\nVotre compte agent pour la juridiction " . $request->input('commune') . " a été créé.\n\nIdentifiants :\nEmail: " . $request->input('email') . "\nMot de passe: " . $temporaryPassword;
            
            MailService::send(
                $request->input('email'),
                $subject,
                $message,
                'agent_creation',
                $userId
            );
        } catch (\Exception $e) {
            // On ignore l'erreur de mail pour ne pas bloquer la création de l'agent en local
        }

        Response::success([
            'agent_id' => $userId,
            'temporary_password' => $temporaryPassword
        ], 'Compte agent créé avec succès');
    }

    /**
     * Liste tous les agents fonciers.
     */
    public function listAgents(Request $request): void
    {
        $sql = "SELECT id, nom, prenom, email, avatar_url, province, ville, commune, created_at FROM users WHERE role = 'agent' ORDER BY created_at DESC";
        $stmt = $this->userModel->db()->prepare($sql);
        $stmt->execute();
        $agents = $stmt->fetchAll();

        Response::success($agents);
    }
}
