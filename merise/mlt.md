graph TD
    subgraph "Unites Logiques de Traitement (ULT)"
        direction TB
        ULT1[Page Login.tsx] -- "POST /api/login" --> ULT1_B[AuthController::login]
        ULT2[Page Register.tsx] -- "POST /api/register" --> ULT2_B[AuthController::register]
        ULT3[Page CreateProperty.tsx] -- "POST /api/owner/properties" --> ULT3_B[PropertyController::store]
        ULT4[Page PropertyDetail.tsx] -- "POST /api/escrow/deposit" --> ULT4_B[TransactionController::store]
    end

    subgraph "Acces Donnees (Services)"
        ULT1_B --> DB_U[SELECT * FROM users]
        ULT2_B --> DB_U2[INSERT INTO users]
        ULT3_B --> DB_P[INSERT INTO properties]
        ULT4_B --> DB_T[INSERT INTO transactions]
    end

    subgraph "Evenements Externes"
        E1[Formulaire Soumis] --> ULT1
        E2[Bouton Acheter] --> ULT4
    end
