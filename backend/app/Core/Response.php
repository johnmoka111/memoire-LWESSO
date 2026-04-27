<?php

declare(strict_types=1);

namespace App\Core;

/**
 * Aide à la génération de réponses HTTP JSON.
 */
final class Response
{
    /**
     * Envoie une réponse JSON et arrête l'exécution.
     */
    public static function json(mixed $data, int $code = 200): void
    {
        http_response_code($code);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }

    /**
     * Réponse de succès standard.
     */
    public static function success(mixed $data = null, string $message = 'Opération réussie'): void
    {
        self::json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ]);
    }

    /**
     * Réponse d'erreur standard.
     */
    public static function error(string $message, int $code = 400, mixed $errors = null): void
    {
        self::json([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors
        ], $code);
    }
}
