<?php

declare(strict_types=1);

namespace App\Core;

/**
 * Routeur MVC maison — dispatche les requêtes HTTP vers les bons Controllers.
 *
 * Usage dans routes/api.php :
 *   $router->get('/api/properties', 'PropertyController@index');
 *   $router->post('/api/auth/login', 'AuthController@login');
 *   $router->put('/api/properties/{id}', 'PropertyController@update', ['auth', 'role:proprietaire']);
 */
final class Router
{
    /** @var array<string, array<string, array{handler: string, middlewares: string[]}>> */
    private array $routes = [];

    // ─── Méthodes d'enregistrement ────────────────────────────────────────────

    public function get(string $path, string $handler, array $middlewares = []): void
    {
        $this->addRoute('GET', $path, $handler, $middlewares);
    }

    public function post(string $path, string $handler, array $middlewares = []): void
    {
        $this->addRoute('POST', $path, $handler, $middlewares);
    }

    public function put(string $path, string $handler, array $middlewares = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middlewares);
    }

    public function delete(string $path, string $handler, array $middlewares = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middlewares);
    }

    private function addRoute(string $method, string $path, string $handler, array $middlewares): void
    {
        $this->routes[$method][$path] = [
            'handler'     => $handler,
            'middlewares' => $middlewares,
        ];
    }

    // ─── Dispatch ────────────────────────────────────────────────────────────

    public function dispatch(string $method, string $uri): void
    {
        $request = new Request();

        foreach ($this->routes[$method] ?? [] as $pattern => $config) {
            $params = $this->match($pattern, $uri);

            if ($params !== null) {
                // Exécuter les middlewares dans l'ordre
                foreach ($config['middlewares'] as $mw) {
                    $this->runMiddleware($mw, $request);
                }

                // Instancier Controller et appeler la méthode
                [$controllerName, $action] = explode('@', $config['handler']);
                $controllerClass = "App\\Controllers\\{$controllerName}";

                if (!class_exists($controllerClass)) {
                    Response::json(['error' => "Controller {$controllerName} introuvable"], 500);
                    return;
                }

                $controller = new $controllerClass();

                if (!method_exists($controller, $action)) {
                    Response::json(['error' => "Méthode {$action} introuvable"], 500);
                    return;
                }

                $controller->$action($request, $params);
                return;
            }
        }

        Response::json(['error' => 'Route introuvable', 'path' => $uri, 'method' => $method], 404);
    }

    // ─── Correspondance avec paramètres dynamiques ────────────────────────────

    /**
     * Convertit /api/properties/{id} en regex et extrait les paramètres.
     * Retourne null si pas de correspondance.
     * @return array<string, string>|null
     */
    private function match(string $pattern, string $uri): ?array
    {
        $regex = preg_replace('/\{([a-z_]+)\}/', '(?P<$1>[^/]+)', $pattern);
        $regex = '#^' . $regex . '$#';

        if (preg_match($regex, $uri, $matches)) {
            // Garder uniquement les groupes nommés (paramètres)
            return array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
        }

        return null;
    }

    // ─── Middlewares ──────────────────────────────────────────────────────────

    private function runMiddleware(string $middleware, Request $request): void
    {
        match (true) {
            $middleware === 'auth'              => (new \App\Middlewares\AuthMiddleware())->handle($request),
            str_starts_with($middleware, 'role:') => (new \App\Middlewares\RoleMiddleware())->handle($request, substr($middleware, 5)),
            default                             => null,
        };
    }
}
