<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\Property;
use App\Models\User;
use App\Models\Document;
use App\Services\MailService;
use App\Services\BlockchainService;
use App\Services\EthPriceService;
use App\Models\Notification;

/**
 * Contrôleur pour les annonces immobilières.
 */
final class PropertyController extends Controller
{
    private Property $propertyModel;

    public function __construct()
    {
        $this->propertyModel = new Property();
    }

    /**
     * Liste toutes les annonces validées.
     */
    public function index(Request $request): void
    {
        $properties = array_map(fn (array $property) => $this->withCurrencyValues($property), $this->propertyModel->getPublicListings());
        Response::success($properties);
    }

    /** Taux indicatif pour prévisualiser la conversion dans le formulaire. */
    public function ethUsdRate(Request $request): void
    {
        Response::success(['usd_per_eth' => EthPriceService::usdRate()]);
    }

    /**
     * Liste TOUTES les annonces pour l'administration.
     */
    public function adminList(Request $request): void
    {
        $sql = "SELECT p.*, u.nom as owner_name 
                FROM properties p 
                JOIN users u ON p.owner_id = u.id 
                ORDER BY p.created_at DESC";
        $stmt = $this->propertyModel->db()->prepare($sql);
        $stmt->execute();
        $properties = $stmt->fetchAll();
        $properties = array_map(fn (array $property) => $this->withCurrencyValues($property), $properties);
        Response::success($properties);
    }

    /**
     * Détails d'une annonce.
     */
    public function show(Request $request, array $params): void
    {
        $id = (int) $params['id'];
        $property = $this->propertyModel->findWithDetails($id);

        if (!$property) {
            Response::error('Propriété non trouvée', 404);
        }

        // Récupérer les documents associés (photos et titres)
        $documentModel = new Document();
        $documents = $documentModel->getDocumentsByProperty((int) $property['id']);
        
        $photos = [];
        $titres = [];
        foreach ($documents as $doc) {
            $item = [
                'url' => $doc['file_url'],
                'description' => $doc['description'] ?? ''
            ];
            
            if ($doc['type'] === 'photo') {
                $photos[] = $item;
            } elseif ($doc['type'] === 'titre_foncier') {
                $titres[] = $doc;
            }
        }
        
        $property = $this->withCurrencyValues($property);
        $property['photos'] = $photos;
        $property['titres_fonciers'] = $titres;

        Response::success($property);
    }

    /**
     * Création d'une annonce (Propriétaire).
     */
    public function store(Request $request): void
    {
        try {
            if (!$request->user) {
                Response::error('Utilisateur non authentifié', 401);
            }

            $ownerId = (int) $request->user['id'];
            $data = $request->all();
            // `prix_usd` est le champ courant. `prix` reste accepté pour les
            // formulaires encore présents dans le cache des anciens navigateurs.
            $priceUsd = (float) ($data['prix_usd'] ?? $data['prix'] ?? 0);
            if ($priceUsd <= 0) {
                Response::error('Le prix en USD doit être supérieur à zéro', 422);
            }
            // USD est la source de vérité. ETH est le montant de règlement recalculé.
            $data['prix_usd'] = round($priceUsd, 2);
            $data['prix'] = EthPriceService::toEth($priceUsd);
            
            // Si c'est un agent qui crée, on l'assigne automatiquement comme agent du bien
            if ($request->user['role'] === 'agent') {
                $data['agent_id'] = $ownerId;
            }

            $propertyId = $this->propertyModel->create($data, $ownerId);

            // Gestion du document principal (Titre Foncier)
            if ($file = $request->file('document')) {
                $this->handleUpload($file, $propertyId, $ownerId, 'titre_foncier');
            }

            // Gestion des photos (ILLIMITÉES avec descriptions)
            $photoCount = (int) $request->input('photo_count', 0);
            for ($i = 0; $i < $photoCount; $i++) {
                if ($photo = $request->file("photo_{$i}")) {
                    $description = $request->input("photo_desc_{$i}", "");
                    $this->handleUpload($photo, $propertyId, $ownerId, 'photo', $description);
                }
            }

            Response::success(['id' => $propertyId], 'Annonce créée avec succès', 201);

        } catch (\Exception $e) {
            Response::error('Erreur interne : ' . $e->getMessage(), 500);
        }
    }

    private function handleUpload(array $file, int $propertyId, int $userId, string $type, string $description = ''): void
    {
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('prop_' . $propertyId . '_') . '.' . $ext;
        
        // Dossier de stockage physique
        $storageDir = ROOT_PATH . '/storage/uploads/';
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0777, true);
        }
        
        $targetPath = $storageDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $docModel = new \App\Models\Document();
            
            // On enregistre un chemin relatif que le serveur pourra servir
            // Sous XAMPP, on peut y accéder via : http://localhost/kivu_immobilier/backend/storage/uploads/
            $baseUrl = "http://localhost/kivu_immobilier/backend/storage/uploads/";
            $fileUrl = $baseUrl . $filename;

            $docModel->register([
                'property_id' => $propertyId,
                'uploaded_by' => $userId,
                'type' => $type,
                'description' => $description,
                'nom_fichier' => $file['name'],
                'file_url' => $fileUrl,
                'mime_type' => $file['type'],
                'taille_bytes' => $file['size'],
                'sha256_hash' => hash_file('sha256', $targetPath)
            ]);
        }
    }

    /**
     * Liste des missions assignées à l'agent connecté.
     */
    public function missions(Request $request): void
    {
        $missions = $this->propertyModel->getPendingMissions((int) $request->user['id']);
        
        // Attacher les documents à chaque mission
        $documentModel = new Document();
        foreach ($missions as &$mission) {
            $mission = $this->withCurrencyValues($mission);
            $mission['documents'] = $documentModel->getDocumentsByProperty((int) $mission['id']);
        }
        
        Response::success($missions);
    }

    private function withCurrencyValues(array $property): array
    {
        if ((float) ($property['prix_usd'] ?? 0) <= 0 && (float) ($property['prix'] ?? 0) > 0) {
            // Compatibilité avec les annonces historiques où seul le montant ETH existe.
            $property['prix_usd'] = EthPriceService::toUsd($property['prix']);
        }
        return $property;
    }

    /**
     * Assigne un agent à une propriété (Admin seulement).
     */
    public function assign(Request $request, array $params): void
    {
        $agentId = (int) $request->input('agent_id');
        $propertyId = (int) $params['id'];

        if (!$agentId) {
            Response::error("L'ID de l'agent est requis", 400);
        }

        // Vérifier si l'agent existe et a le bon rôle
        $userModel = new User();
        $agent = $userModel->find($agentId);
        
        if (!$agent || $agent['role'] !== 'agent') {
            Response::error("L'utilisateur spécifié n'est pas un agent valide", 400);
        }

        $success = $this->propertyModel->assignAgent($propertyId, $agentId);

        if ($success) {
            // Notification Email à l'agent
            MailService::send(
                $agent['email'],
                "Nouvelle mission d'inspection - Kivu Immobilier",
                "<h1>Bonjour " . $agent['prenom'] . "</h1><p>Une nouvelle mission de validation terrain vous a été assignée. Veuillez consulter votre dashboard pour plus de détails.</p>",
                'assignment',
                $agentId
            );

            Response::success(null, "Agent assigné avec succès et notifié par email");
        } else {
            Response::error("Erreur lors de l'assignation");
        }
    }

    /**
     * Validation terrain par un agent (ajoute le panorama 360).
     */
    public function validate(Request $request, array $params): void
    {
        $propertyId = (int) $params['id'];
        $panoramaUrl = $request->input('panorama_url') ?: '';

        // --- SÉCURITÉ : Vérifier si l'agent est bien assigné à cette propriété ---
        $property = $this->propertyModel->find($propertyId);
        if (!$property) {
            Response::error('Annonce introuvable', 404);
        }

        if ((int)$property['agent_id'] !== (int)$request->user['id']) {
            Response::error('Accès refusé. Vous n\'êtes pas l\'agent assigné à cette propriété.', 403);
        }

        if ($property['statut'] !== 'assigne') {
            Response::error('Cette annonce n\'est pas dans un état permettant la validation terrain.', 400);
        }

        // 1. Validation de l'annonce en base de données
        $success = $this->propertyModel->validate($propertyId, (int) $request->user['id'], $panoramaUrl);
        
        if ($success) {
            // 2. Ancrage Blockchain des titres fonciers associés
            $documentModel = new Document();
            $blockchain = new BlockchainService();
            $titres = $documentModel->getDocumentsByType($propertyId, 'titre_foncier');
            
            $anchoredCount = 0;
            foreach ($titres as $titre) {
                $txHash = $blockchain->anchorDocument($titre['sha256_hash']);
                if ($txHash) {
                    $documentModel->updateBlockchainInfo((int)$titre['id'], '0x'.$titre['sha256_hash'], $txHash);
                    $anchoredCount++;
                }
            }

            // 3. Notification par Email au Propriétaire
            if ($property['owner_id']) {
                $userModel = new \App\Models\User();
                $owner = $userModel->find((int)$property['owner_id']);
                
                if ($owner) {
                    \App\Services\MailService::send(
                        $owner['email'],
                        "Bonne nouvelle ! Votre annonce est en ligne",
                        "<h1>Annonce Validée !</h1>
                         <p>Bonjour {$owner['nom']},</p>
                         <p>Votre bien <strong>{$property['titre']}</strong> situé à <strong>{$property['quartier']}, {$property['commune']}</strong> a été validé par notre agent terrain.</p>
                         <p>Il est désormais visible par tous nos utilisateurs sur la plateforme Kivu Immobilier.</p>
                         <br>
                         <p><em>L'équipe Kivu Immobilier</em></p>",
                        'validation_owner',
                        (int)$owner['id']
                    );

                    // Notification Interne
                    (new Notification())->create([
                        'user_id' => $owner['id'],
                        'title' => "Annonce Validée : " . $property['titre'],
                        'message' => "Votre bien situé à {$property['commune']} a été validé par l'agent terrain et est maintenant en ligne.",
                        'type' => 'success'
                    ]);
                }
            }

            // 4. Notification par Email à l'Administrateur
            \App\Services\MailService::send(
                MAIL_FROM, // Admin email par défaut
                "Mission terminée : Bien validé à {$property['commune']}",
                "<h1>Validation Terrain Effectuée</h1>
                 <p>L'agent <strong>{$request->user['prenom']} {$request->user['nom']}</strong> a validé le bien suivant :</p>
                 <ul>
                    <li><strong>Bien :</strong> {$property['titre']}</li>
                    <li><strong>Localisation :</strong> {$property['quartier']}, {$property['commune']}</li>
                    <li><strong>Documents ancrés :</strong> {$anchoredCount}</li>
                 </ul>
                 <p>Le bien est maintenant public.</p>",
                'validation_admin'
            );

            Response::success([
                'anchored_documents' => $anchoredCount
            ], 'Annonce validée, documents ancrés et notifications envoyées avec succès');
        } else {
            Response::error('Erreur lors de la validation');
        }
    }

    /**
     * Récupère les statistiques pour le dashboard selon le rôle.
     */
    public function getDashboardStats(Request $request): void
    {
        $userId = (int) $request->user['id'];
        $role = $request->user['role'];
        $db = $this->propertyModel->db();

        $stats = [
            'total_properties' => 0,
            'active_escrow' => 0,
            'recent_transactions' => 0,
            'sold_properties' => 0,
            'unsold_properties' => 0,
            'sold_value_usd' => 0,
            'unsold_value_usd' => 0,
            'pending_properties' => 0
        ];

        if (in_array(strtolower(trim($role)), ['admin', 'superadmin', 'administrateur'])) {
            try {
                $propertyTotals = $db->query("SELECT
                    COUNT(*) AS total_properties,
                    SUM(CASE WHEN statut = 'vendu' THEN 1 ELSE 0 END) AS sold_properties,
                    SUM(CASE WHEN statut NOT IN ('vendu', 'rejete') THEN 1 ELSE 0 END) AS unsold_properties,
                    SUM(CASE WHEN statut = 'vendu' THEN COALESCE(prix_usd, 0) ELSE 0 END) AS sold_value_usd,
                    SUM(CASE WHEN statut NOT IN ('vendu', 'rejete') THEN COALESCE(prix_usd, 0) ELSE 0 END) AS unsold_value_usd,
                    SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) AS pending_properties
                    FROM properties")->fetch();
                $stats = array_merge($stats, array_map(static fn ($value) => (float) ($value ?? 0), $propertyTotals ?: []));
                $stats['total_properties'] = (int) $stats['total_properties'];
                $stats['sold_properties'] = (int) $stats['sold_properties'];
                $stats['unsold_properties'] = (int) $stats['unsold_properties'];
                $stats['pending_properties'] = (int) $stats['pending_properties'];
            } catch (\Exception $e) { /* Les valeurs par défaut restent à zéro. */ }

            try {
                $stats['total_agents'] = (int) $db->query("SELECT COUNT(*) FROM users WHERE LOWER(role) = 'agent'")->fetchColumn();
            } catch (\Exception $e) { $stats['total_agents'] = 0; }

            try {
                $stats['active_escrow'] = (float) ($db->query("SELECT SUM(montant_usd) FROM transactions WHERE etat = 'cree'")->fetchColumn() ?: 0);
                $stats['recent_transactions'] = (int) $db->query("SELECT COUNT(*) FROM transactions")->fetchColumn();
            } catch (\Exception $e) {
                $stats['active_escrow'] = 0;
                $stats['recent_transactions'] = 0;
            }
        } elseif (strtolower(trim($role)) === 'agent') {
            try {
                $agentInfo = (new User())->find($userId);
                $commune = $agentInfo['commune'] ?? '';
                
                $sql = "SELECT COUNT(*) FROM properties WHERE agent_id = ? OR owner_id = ? OR (commune = ? AND agent_id IS NULL) OR (statut = 'en_attente')";
                $stmt = $db->prepare($sql);
                $stmt->execute([$userId, $userId, $commune]);
                $stats['total_properties'] = (int) $stmt->fetchColumn();
            } catch (\Exception $e) { $stats['total_properties'] = 0; }
            
            try {
                $stats['recent_transactions'] = (int) $db->query("SELECT COUNT(*) FROM transactions t JOIN properties p ON t.property_id = p.id WHERE p.commune = '$commune'")->fetchColumn();
            } catch (\Exception $e) { $stats['recent_transactions'] = 0; }
        } else {
            try {
                $stmt = $db->prepare("SELECT COUNT(*) FROM properties WHERE owner_id = ?");
                $stmt->execute([$userId]);
                $stats['total_properties'] = (int) $stmt->fetchColumn();
            } catch (\Exception $e) { $stats['total_properties'] = 0; }
        }

        Response::success($stats);
    }
    /**
     * Rejet d'une annonce par l'agent (Litige).
     */
    public function reject(Request $request, array $params): void
    {
        $propertyId = (int) $params['id'];
        $reason = $request->input('reason', 'Raison non spécifiée');
        
        $property = $this->propertyModel->find($propertyId);
        if (!$property) {
            Response::error('Annonce introuvable', 404);
        }

        if ((int)$property['agent_id'] !== (int)$request->user['id']) {
            Response::error('Accès refusé. Vous n\'êtes pas l\'agent assigné.', 403);
        }

        if ($this->propertyModel->reject($propertyId, (int)$request->user['id'], $reason)) {
            // Notification au Propriétaire
            if ($property['owner_id']) {
                $userModel = new \App\Models\User();
                $owner = $userModel->find((int)$property['owner_id']);
                
                if ($owner) {
                    \App\Services\MailService::send(
                        $owner['email'],
                        "Action Requise : Votre annonce a été suspendue",
                        "<h1>Annonce Suspendue / Rejetée</h1>
                         <p>Bonjour {$owner['nom']},</p>
                         <p>Nous vous informons que votre bien <strong>{$property['titre']}</strong> a été examiné par notre agent terrain et a été <strong>rejeté</strong> pour la raison suivante :</p>
                         <div style='background: #fff5f5; border: 1px solid #feb2b2; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                            <strong>Motif du rejet :</strong><br>
                            {$reason}
                         </div>
                         <p>Votre annonce n'est plus visible publiquement. Veuillez contacter le support ou corriger les informations nécessaires.</p>
                         <br>
                         <p><em>L'équipe de Sécurité Kivu Immobilier</em></p>",
                        'rejet_owner',
                        (int)$owner['id']
                    );

                    // Notification Interne
                    (new Notification())->create([
                        'user_id' => $owner['id'],
                        'title' => "Action Requise : Votre annonce a été rejetée",
                        'message' => "Votre bien {$property['titre']} a été rejeté pour le motif suivant : {$reason}. Veuillez corriger les informations.",
                        'type' => 'danger'
                    ]);
                }
            }

            // Notification à l'Admin
            \App\Services\MailService::send(
                MAIL_FROM,
                "ALERTE LITIGE : Bien rejeté par agent",
                "<h1>Signalement de Litige</h1>
                 <p>L'agent <strong>{$request->user['prenom']} {$request->user['nom']}</strong> a rejeté un bien lors de sa visite terrain.</p>
                 <ul>
                    <li><strong>Bien :</strong> {$property['titre']}</li>
                    <li><strong>Localisation :</strong> {$property['commune']}</li>
                    <li><strong>Motif :</strong> {$reason}</li>
                 </ul>",
                'rejet_admin'
            );

            Response::success(null, 'Annonce rejetée et notifications envoyées.');
        } else {
            Response::error('Erreur lors du rejet.');
        }
    }
}
