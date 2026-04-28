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
        $errors = $request->validate([
            'titre' => 'required|max:255',
            'prix' => 'required|numeric',
            'commune' => 'required'
        ]);

        if (!empty($errors)) {
            Response::error('Données invalides', 422, $errors);
        }

        $id = $this->propertyModel->create($request->all(), $request->user['id']);
        Response::success(['id' => $id], 'Annonce créée, en attente de validation par un agent', 201);
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
