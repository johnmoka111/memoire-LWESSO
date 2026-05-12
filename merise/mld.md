erDiagram
    UTILISATEURS {
        int id PK
        string nom
        string prenom
        string email UK
        string mot_de_passe
        string role
    }

    PROPRIETES {
        int id PK
        int owner_id FK
        int agent_id FK
        string titre
        float prix
        string statut
    }

    TRANSACTIONS {
        int id PK
        int property_id FK
        int acheteur_id FK
        string escrow_id
        float montant_eth
        string statut
    }

    DOCUMENTS {
        int id PK
        int property_id FK
        string chemin_fichier
        string type_doc
    }

    MESSAGES {
        int id PK
        int expediteur_id FK
        int destinataire_id FK
        text contenu
        datetime date_envoi
    }

    UTILISATEURS ||--o{ PROPRIETES : "possede"
    UTILISATEURS ||--o{ TRANSACTIONS : "achete"
    PROPRIETES ||--o{ DOCUMENTS : "justifiee_par"
    PROPRIETES ||--o| TRANSACTIONS : "concerne"
    UTILISATEURS ||--o{ MESSAGES : "envoie/recoit"
