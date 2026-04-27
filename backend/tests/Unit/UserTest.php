<?php

declare(strict_types=1);

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\User;
use App\Core\Database;

/**
 * Test du modèle User.
 */
final class UserTest extends TestCase
{
    private User $userModel;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userModel = new User();
    }

    /**
     * Teste que la recherche par email retourne null pour un email inexistant.
     */
    public function testFindByEmailReturnsNullForUnknownEmail(): void
    {
        $result = $this->userModel->findByEmail('nonexistent@test.com');
        $this->assertNull($result);
    }

    /**
     * Teste la validation simple d'un mot de passe (password_verify).
     */
    public function testPasswordHashingWorks(): void
    {
        $password = "Kivu2026!";
        $hash = password_hash($password, PASSWORD_BCRYPT);
        
        $this->assertTrue(password_verify($password, $hash));
        $this->assertFalse(password_verify("MauvaisPass", $hash));
    }
}
