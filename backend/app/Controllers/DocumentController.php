<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\Document;
use App\Services\BlockchainService;
use Google\Cloud\Storage\StorageClient;
use Exception;

/**
 * Contrôleur pour l'upload de documents et photos.
 */
final class DocumentController extends Controller
{
    private Document $documentModel;

    public function __construct()
    {
        $this->documentModel = new Document();
    }

    /**
     * Upload d'un fichier sur Google Cloud Storage + Hachage SHA256.
     */
    public function upload(Request $request): void
    {
        $file = $request->file('file');
        $propertyId = $request->input('property_id');
        $type = $request->input('type', 'autre');

        if (!$file || !$propertyId) {
            Response::error('Fichier et ID de propriété requis', 400);
        }

        // --- SÉCURITÉ : Validation du type de fichier ---
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $mimeType = $file['type'];

        // On vérifie si l'extension ou le type MIME est autorisé (config/app.php)
        if (!in_array($mimeType, UPLOAD_ALLOWED) && !in_array('image/'.$extension, UPLOAD_ALLOWED)) {
            Response::error('Type de fichier non autorisé. Autorisés : ' . implode(', ', UPLOAD_ALLOWED), 400);
        }

        // Protection contre les scripts (ex: .php, .phtml, .exe)
        $forbidden = ['php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'exe', 'sh', 'bat'];
        if (in_array($extension, $forbidden)) {
            Response::error('Extension de fichier interdite pour des raisons de sécurité.', 403);
        }

        // 1. Calcul du Hash SHA256 (pour la blockchain)
        $fileContent = file_get_contents($file['tmp_name']);
        $sha256 = hash('sha256', $fileContent);

        try {
            // 2. Upload vers Google Cloud Storage
            // NOTE: Nécessite config/gcs-key.json
            $storage = new StorageClient([
                'projectId' => GCS_PROJECT,
                'keyFilePath' => GCS_CREDENTIALS
            ]);
            $bucket = $storage->bucket(GCS_BUCKET);
            
            // On renomme le fichier avec un hash pour éviter l'écrasement et les injections de noms
            $objectName = bin2hex(random_bytes(16)) . '.' . $extension;
            $object = $bucket->upload($fileContent, [
                'name' => $objectName
            ]);

            $fileUrl = "https://storage.googleapis.com/" . GCS_BUCKET . "/" . $objectName;

            // 3. Enregistrement en base de données
            $docId = $this->documentModel->register([
                'property_id' => $propertyId,
                'uploaded_by' => $request->user['id'],
                'type' => $type,
                'nom_fichier' => $file['name'],
                'file_url' => $fileUrl,
                'mime_type' => $mimeType,
                'taille_bytes' => $file['size'],
                'sha256_hash' => $sha256
            ]);

            Response::success([
                'id' => $docId,
                'url' => $fileUrl,
                'hash' => $sha256
            ], 'Fichier uploadé avec succès');

        } catch (Exception $e) {
            // En développement, on peut simuler l'upload local si GCS n'est pas configuré
            if (APP_ENV === 'development') {
                $objectName = bin2hex(random_bytes(16)) . '.' . $extension;
                $localPath = STORAGE_PATH . $objectName;
                
                if (!is_dir(STORAGE_PATH)) {
                    mkdir(STORAGE_PATH, 0755, true);
                }

                move_uploaded_file($file['tmp_name'], $localPath);
                
                $docId = $this->documentModel->register([
                    'property_id' => $propertyId,
                    'uploaded_by' => $request->user['id'],
                    'type' => $type,
                    'nom_fichier' => $file['name'],
                    'file_url' => $localPath,
                    'mime_type' => $mimeType,
                    'taille_bytes' => $file['size'],
                    'sha256_hash' => $sha256
                ]);

                Response::success([
                    'id' => $docId,
                    'hash' => $sha256,
                    'local' => true
                ], 'Upload simulé en local (GCS non configuré)');
            }

            Response::error('Erreur lors de l\'upload : ' . $e->getMessage(), 500);
        }
    }
}
