<?php

declare(strict_types=1);

namespace Tests\Integration;

use PHPUnit\Framework\TestCase;
use App\Core\Request;

/**
 * Test de la validation des requêtes.
 */
final class RequestValidationTest extends TestCase
{
    /**
     * Teste que la validation détecte les erreurs d'email et de champs obligatoires.
     */
    public function testValidationDetectsErrors(): void
    {
        // On simule une requête avec des données invalides
        // Note: Pour tester cela proprement sans serveur, on peut injecter les données manuellement
        $request = new Request();
        
        // Simuler des données d'input (on force via réflexion ou une méthode helper si nécessaire)
        // Ici on teste la logique pure de la méthode validate()
        $rules = [
            'email' => 'required|email',
            'nom' => 'required|max:10'
        ];

        // On ne peut pas facilement remplir 'body' car c'est php://input
        // Mais on peut tester la structure des erreurs retournées
        $errors = $request->validate($rules);
        
        $this->assertArrayHasKey('email', $errors);
        $this->assertArrayHasKey('nom', $errors);
    }
}
