<?php

declare(strict_types=1);

namespace App\Core;

/**
 * Encapsule la requête HTTP entrante.
 * Fournit un accès sécurisé au body JSON, query params, headers et fichiers.
 */
final class Request
{
    private array $body    = [];
    private array $query   = [];
    private array $headers = [];

    /** Données de l'utilisateur authentifié (injectées par AuthMiddleware) */
    public ?array $user = null;

    public function __construct()
    {
        $this->query   = $_GET;
        $this->headers = getallheaders() ?: [];

        // Fallback pour Apache qui cache parfois l'Authorization header
        if (!isset($this->headers['Authorization']) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $this->headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (!isset($this->headers['Authorization']) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $this->headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        // Décoder le body JSON automatiquement
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->body = array_merge($this->body, $decoded);
            }
        }

        // Fusionner avec $_POST pour les requêtes multipart/form-data (Uploads)
        if (!empty($_POST)) {
            $this->body = array_merge($this->body, $_POST);
        }
    }

    /** Récupère un champ du body JSON avec valeur par défaut */
    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $default;
    }

    /** Récupère tous les champs du body JSON */
    public function all(): array
    {
        return $this->body;
    }

    /** Récupère un query param (?key=value) */
    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    /** Récupère un header HTTP */
    public function header(string $key, mixed $default = null): mixed
    {
        $normalized = strtolower($key);
        foreach ($this->headers as $name => $value) {
            if (strtolower($name) === $normalized) {
                return $value;
            }
        }
        return $default;
    }

    /** Récupère le token Bearer depuis Authorization header */
    public function bearerToken(): ?string
    {
        $auth = $this->header('Authorization', '');
        if (str_starts_with($auth, 'Bearer ')) {
            return substr($auth, 7);
        }
        return null;
    }

    /** Récupère un fichier uploadé */
    public function file(string $key): ?array
    {
        return isset($_FILES[$key]) && $_FILES[$key]['error'] === UPLOAD_ERR_OK
            ? $_FILES[$key]
            : null;
    }

    /** Valide les champs requis */
    public function validate(array $rules): array
    {
        $errors = [];
        foreach ($rules as $field => $rule) {
            $value = $this->input($field);
            foreach (explode('|', $rule) as $r) {
                match (true) {
                    $r === 'required' && empty($value)       => $errors[$field][] = "{$field} est obligatoire",
                    str_starts_with($r, 'max:') && !empty($value) && strlen((string)$value) > (int)substr($r, 4)
                                                             => $errors[$field][] = "{$field} trop long",
                    $r === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)
                                                             => $errors[$field][] = "{$field} invalide",
                    $r === 'numeric' && !is_numeric($value)  => $errors[$field][] = "{$field} doit être numérique",
                    default                                  => null,
                };
            }
        }
        return $errors;
    }
}
