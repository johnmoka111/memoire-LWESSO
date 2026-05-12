erDiagram
    users {
        int(11) id PK
        varchar(100) nom
        varchar(100) prenom
        varchar(255) email UK
        varchar(255) password
        enum_role role
        datetime created_at
    }

    properties {
        int(11) id PK
        int(11) owner_id FK
        int(11) agent_id FK
        varchar(255) titre
        text description
        decimal_12_2 prix
        varchar(100) commune
        varchar(100) quartier
        double latitude
        double longitude
        float superficie
        enum_statut statut
        varchar(255) image_url
        varchar(255) panorama_url
        datetime created_at
    }

    transactions {
        int(11) id PK
        int(11) property_id FK
        int(11) acheteur_id FK
        varchar(100) escrow_id UK
        varchar(42) contract_address
        decimal_20_8 montant_eth
        varchar(100) status
        varchar(66) tx_hash
        datetime created_at
    }

    documents {
        int(11) id PK
        int(11) property_id FK
        varchar(255) file_path
        varchar(50) type
        varchar(100) ipfs_hash
        datetime created_at
    }

    users ||--o{ properties : "owner_id"
    properties ||--o{ documents : "property_id"
    properties ||--o| transactions : "property_id"
    users ||--o{ transactions : "acheteur_id"
