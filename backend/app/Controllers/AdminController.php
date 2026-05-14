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

        // Envoi d'email professionnel
        try {
            $subject = "🎯 Vos accès Agent - KivuMarket+";
            $htmlBody = "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 20px;'>
                        <h1 style='color: #4F46E5;'>KivuMarket+</h1>
                    </div>
                    <p>Bonjour <strong>{$agentData['prenom']}</strong>,</p>
                    <p>Votre compte agent a été activé avec succès dans le système de gestion foncière <strong>KivuMarket+</strong>.</p>
                    
                    <div style='background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <h3 style='margin-top: 0;'>📍 Affectation</h3>
                        <p><strong>Province :</strong> {$agentData['province']}<br>
                           <strong>Ville :</strong> {$agentData['ville']}<br>
                           <strong>Commune :</strong> {$agentData['commune']}</p>
                    </div>

                    <div style='background: #4F46E5; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <h3 style='margin-top: 0;'>🔑 Vos Identifiants</h3>
                        <p><strong>Email :</strong> {$agentData['email']}<br>
                           <strong>Mot de passe :</strong> <span style='font-family: monospace; font-size: 1.2em;'>{$temporaryPassword}</span></p>
                    </div>

                    <p style='font-size: 0.9em; color: #666;'>Pour votre sécurité, nous vous recommandons de changer ce mot de passe lors de votre première connexion.</p>
                    
                    <div style='text-align: center; margin-top: 30px;'>
                        <a href='http://localhost:3000' style='background: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Accéder à mon espace</a>
                    </div>
                </div>
            ";
            
            MailService::send($agentData['email'], $subject, $htmlBody, 'agent_creation', $userId);
        } catch (\Exception $e) {
            // Log error if needed
        }

        Response::success([
            'agent_id' => $userId,
            'temporary_password' => $temporaryPassword
        ], 'Compte agent créé avec succès');
    }

    /**
     * Réinitialise le mot de passe d'un agent et lui envoie les nouveaux accès.
     */
    public function resetAgentPassword(Request $request, array $params): void
    {
        $id = (int) $params['id'];
        $agent = $this->userModel->find($id);

        if (!$agent || $agent['role'] !== 'agent') {
            Response::error('Agent non trouvé');
        }

        $newPassword = bin2hex(random_bytes(4));
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

        $sql = "UPDATE users SET password = ? WHERE id = ?";
        $stmt = $this->userModel->db()->prepare($sql);
        $success = $stmt->execute([$hashedPassword, $id]);

        if ($success) {
            // Envoyer le nouvel email
            $subject = "🔑 Réinitialisation de vos accès - KivuMarket+";
            $htmlBody = "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;'>
                    <h2>Nouveaux accès KivuMarket+</h2>
                    <p>Bonjour <strong>{$agent['prenom']}</strong>,</p>
                    <p>Votre mot de passe a été réinitialisé par l'administrateur.</p>
                    <div style='background: #f4f4f4; padding: 15px; border-radius: 10px;'>
                        <p><strong>Nouveau mot de passe :</strong> <span style='font-family: monospace; font-size: 1.5em;'>{$newPassword}</span></p>
                    </div>
                    <p>Vous pouvez maintenant vous connecter avec ce nouveau code.</p>
                </div>
            ";
            MailService::send($agent['email'], $subject, $htmlBody, 'password_reset', $id);

            Response::success(['new_password' => $newPassword], 'Mot de passe réinitialisé et envoyé par email');
        } else {
            Response::error('Erreur lors de la réinitialisation');
        }
    }

    /**
     * Liste tous les agents fonciers.
     */
    public function listAgents(Request $request): void
    {
        $sql = "SELECT id, nom, prenom, email, telephone, avatar_url, province, ville, commune, is_active, created_at FROM users WHERE role = 'agent' ORDER BY created_at DESC";
        $stmt = $this->userModel->db()->prepare($sql);
        $stmt->execute();
        $agents = $stmt->fetchAll();

        Response::success($agents);
    }

    /**
     * Met à jour les informations d'un agent (CRUD).
     */
    public function updateAgent(Request $request, array $params): void
    {
        $id = (int) $params['id'];
        $data = $request->all();
        
        // On construit la requête dynamiquement pour ne mettre à jour que ce qui est envoyé
        $fields = [];
        $values = [];
        
        $allowedFields = ['nom', 'prenom', 'telephone', 'province', 'ville', 'commune', 'is_active', 'avatar_url'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "{$field} = ?";
                $values[] = $data[$field];
            }
        }
        
        if (empty($fields)) {
            Response::error('Aucune donnée à mettre à jour');
        }
        
        $values[] = $id;
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ? AND role = 'agent'";
        
        $stmt = $this->userModel->db()->prepare($sql);
        $success = $stmt->execute($values);
        
        if ($success) {
            Response::success(null, 'Informations de l\'agent mises à jour');
        } else {
            Response::error('Erreur lors de la mise à jour', 500);
        }
    }

    /**
     * Supprime un agent (CRUD).
     */
    public function deleteAgent(Request $request, array $params): void
    {
        $id = (int) $params['id'];
        $success = $this->userModel->delete($id);
        
        if ($success) {
            Response::success(null, 'Agent supprimé avec succès');
        } else {
            Response::error('Erreur lors de la suppression', 500);
        }
    }
}
