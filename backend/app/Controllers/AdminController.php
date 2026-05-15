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
            $subject = "Activation de compte Agent - KivuMarket+";
            $htmlBody = "
                <div style='font-family: \"Segoe UI\", Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 4px; padding: 40px; color: #1e293b;'>
                    <div style='border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px;'>
                        <h1 style='color: #0f172a; margin: 0; font-size: 24px; letter-spacing: -0.025em;'>KIVUMARKET+</h1>
                        <p style='color: #64748b; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 0.1em;'>Système de Gestion Foncière</p>
                    </div>

                    <p style='font-size: 16px; line-height: 1.6;'>Bonjour {$agentData['prenom']},</p>
                    <p style='font-size: 16px; line-height: 1.6;'>Votre compte agent a été activé avec succès dans le système de gestion foncière KivuMarket+.</p>
                    
                    <div style='margin: 30px 0; border: 1px solid #e2e8f0; border-radius: 4px;'>
                        <div style='background: #f8fafc; padding: 15px; border-bottom: 1px solid #e2e8f0;'>
                            <h3 style='margin: 0; font-size: 14px; text-transform: uppercase; color: #475569;'>Affectation territoriale</h3>
                        </div>
                        <div style='padding: 20px;'>
                            <table style='width: 100%; font-size: 14px;'>
                                <tr><td style='color: #64748b; padding-bottom: 5px;'>Province :</td><td style='font-weight: 600;'>{$agentData['province']}</td></tr>
                                <tr><td style='color: #64748b; padding-bottom: 5px;'>Ville :</td><td style='font-weight: 600;'>{$agentData['ville']}</td></tr>
                                <tr><td style='color: #64748b;'>Commune :</td><td style='font-weight: 600;'>{$agentData['commune']}</td></tr>
                            </table>
                        </div>
                    </div>

                    <div style='margin: 30px 0; background: #0f172a; color: #ffffff; border-radius: 4px; padding: 25px;'>
                        <h3 style='margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; opacity: 0.8;'>Identifiants de connexion</h3>
                        <p style='margin: 5px 0; font-size: 14px;'>Identifiant : <strong>{$agentData['email']}</strong></p>
                        <p style='margin: 5px 0; font-size: 14px;'>Mot de passe : <span style='font-family: monospace; font-size: 16px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 2px;'>{$temporaryPassword}</span></p>
                    </div>

                    <p style='font-size: 13px; color: #64748b; font-style: italic;'>
                        Par mesure de sécurité, nous vous recommandons de modifier ce mot de passe lors de votre première session.
                    </p>
                    
                    <div style='margin-top: 40px; text-align: center;'>
                        <a href='http://localhost:3000/#/login' style='display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;'>ACCÉDER À MON ESPACE</a>
                    </div>

                    <div style='margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;'>
                        Ceci est un message automatique, merci de ne pas y répondre.<br>
                        &copy; " . date('Y') . " KivuMarket+ - Sécurité Foncière Blockchain.
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
            $subject = "Réinitialisation des accès - KivuMarket+";
            $htmlBody = "
                <div style='font-family: \"Segoe UI\", Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 4px; padding: 40px; color: #1e293b;'>
                    <div style='border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px;'>
                        <h1 style='color: #0f172a; margin: 0; font-size: 24px;'>KIVUMARKET+</h1>
                    </div>

                    <p style='font-size: 16px;'>Bonjour {$agent['prenom']},</p>
                    <p style='font-size: 16px;'>Votre mot de passe a été réinitialisé par l'administration.</p>
                    
                    <div style='margin: 30px 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 25px;'>
                        <p style='margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase;'>Nouveau mot de passe provisoire</p>
                        <p style='margin: 10px 0 0 0; font-family: monospace; font-size: 24px; color: #0f172a; font-weight: bold;'>{$newPassword}</p>
                    </div>

                    <p style='font-size: 14px; color: #64748b;'>Vous pouvez désormais vous connecter à votre espace agent avec ce nouveau code.</p>
                    
                    <div style='margin-top: 40px; text-align: center;'>
                        <a href='http://localhost:3000/#/login' style='display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600;'>SE CONNECTER</a>
                    </div>
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
        
        // Récupérer l'ancien état pour comparer l'affectation
        $oldAgent = $this->userModel->find($id);
        if (!$oldAgent) {
            Response::error('Agent non trouvé');
        }

        // On construit la requête dynamiquement
        $fields = [];
        $values = [];
        $allowedFields = ['nom', 'prenom', 'telephone', 'province', 'ville', 'commune', 'is_active', 'avatar_url'];
        
        $assignmentChanged = false;
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                // Vérifier si l'affectation a changé
                if (in_array($field, ['province', 'ville', 'commune']) && $data[$field] !== $oldAgent[$field]) {
                    $assignmentChanged = true;
                }
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
            // Envoyer un mail si l'affectation a changé
            if ($assignmentChanged) {
                try {
                    $subject = "Mise à jour de votre affectation - KivuMarket+";
                    $htmlBody = "
                        <div style='font-family: \"Segoe UI\", Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 4px; padding: 40px; color: #1e293b;'>
                            <div style='border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px;'>
                                <h1 style='color: #0f172a; margin: 0; font-size: 24px; letter-spacing: -0.025em;'>KIVUMARKET+</h1>
                                <p style='color: #64748b; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 0.1em;'>Système de Gestion Foncière</p>
                            </div>

                            <p style='font-size: 16px; line-height: 1.6;'>Bonjour {$oldAgent['prenom']},</p>
                            <p style='font-size: 16px; line-height: 1.6;'>Votre affectation territoriale a été modifiée par l'administration.</p>
                            
                            <div style='margin: 30px 0; border: 1px solid #e2e8f0; border-radius: 4px;'>
                                <div style='background: #f8fafc; padding: 15px; border-bottom: 1px solid #e2e8f0;'>
                                    <h3 style='margin: 0; font-size: 14px; text-transform: uppercase; color: #475569;'>Nouvelle affectation</h3>
                                </div>
                                <div style='padding: 20px;'>
                                    <table style='width: 100%; font-size: 14px;'>
                                        <tr><td style='color: #64748b; padding-bottom: 5px;'>Province :</td><td style='font-weight: 600;'>" . ($data['province'] ?? $oldAgent['province']) . "</td></tr>
                                        <tr><td style='color: #64748b; padding-bottom: 5px;'>Ville :</td><td style='font-weight: 600;'>" . ($data['ville'] ?? $oldAgent['ville']) . "</td></tr>
                                        <tr><td style='color: #64748b;'>Commune :</td><td style='font-weight: 600;'>" . ($data['commune'] ?? $oldAgent['commune']) . "</td></tr>
                                    </table>
                                </div>
                            </div>

                            <p style='font-size: 14px; color: #64748b; line-height: 1.6;'>
                                Vous êtes désormais chargé de la validation des titres et de l'expertise terrain dans cette zone géographique. Toutes vos missions en cours restent accessibles dans votre espace agent.
                            </p>
                            
                            <div style='margin-top: 40px; text-align: center;'>
                                <a href='http://localhost:3000/#/login' style='display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;'>ACCÉDER À MON ESPACE</a>
                            </div>

                            <div style='margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;'>
                                Ceci est un message automatique, merci de ne pas y répondre.<br>
                                &copy; " . date('Y') . " KivuMarket+ - Sécurité Foncière Blockchain.
                            </div>
                        </div>
                    ";
                    MailService::send($oldAgent['email'], $subject, $htmlBody, 'assignment_change', $id);
                } catch (\Exception $e) {}
            }

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
