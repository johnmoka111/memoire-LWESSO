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
        $properties = $this->propertyModel->getPublicListings();
        Response::success($properties);
    }

    /**
     * Détail d'une annonce.
     */
    public function show(Request $request, array $params): void
    {
        $property = $this->propertyModel->find((int) $params['id']);
        if (!$property) {
            Response::error('Annonce introuvable', 404);
        }
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
            
            // Validation basique des champs requis
            if (!$request->input('titre') || !$request->input('prix') || !$request->input('commune')) {
                Response::error('Champs titre, prix et commune obligatoires', 400);
            }

            $propertyId = $this->propertyModel->create($request->all(), $ownerId);

            // Gestion du document principal (Titre Foncier)
            if ($file = $request->file('document')) {
                $this->handleUpload($file, $propertyId, $ownerId, 'titre_foncier');
            }

            // Gestion des photos (Max 5)
            $photoCount = (int) $request->input('photo_count', 0);
            for ($i = 0; $i < $photoCount; $i++) {
                if ($photo = $request->file("photo_{$i}")) {
                    $this->handleUpload($photo, $propertyId, $ownerId, 'photo');
                }
            }

            Response::success(['id' => $propertyId], 'Annonce créée avec succès', 201);

        } catch (\Exception $e) {
            Response::error('Erreur interne : ' . $e->getMessage(), 500);
        }
    }

    private function handleUpload(array $file, int $propertyId, int $userId, string $type): void
    {
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('prop_' . $propertyId . '_') . '.' . $ext;
        $targetPath = STORAGE_PATH . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $docModel = new \App\Models\Document();
            $docModel->register([
                'property_id' => $propertyId,
                'uploaded_by' => $userId,
                'type' => $type,
                'nom_fichier' => $file['name'],
                'file_url' => '/storage/uploads/' . $filename,
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
            $mission['documents'] = $documentModel->getDocumentsByProperty((int) $mission['id']);
        }
        
        Response::success($missions);
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
                "Nouvelle mission d'inspection - KivuMarket+",
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
        $panoramaUrl = $request->input('panorama_url');
        
        if (!$panoramaUrl) {
            Response::error('Le lien du panorama 360° est requis pour la validation', 400);
        }

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

            Response::success([
                'anchored_documents' => $anchoredCount
            ], 'Annonce validée et documents ancrés sur la blockchain avec succès');
        } else {
            Response::error('Erreur lors de la validation');
        }
    }
}
