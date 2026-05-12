erDiagram
    UTILISATEUR ||--o{ PROPRIETE : "possede"
    UTILISATEUR ||--o{ TRANSACTION : "effectue"
    PROPRIETE ||--o| TRANSACTION : "est_objet_de"
    PROPRIETE ||--o{ DOCUMENT : "contient"
    PROPRIETE ||--o{ HISTORIQUE : "subit"
    UTILISATEUR ||--o{ MESSAGE : "envoie"
    UTILISATEUR ||--o{ MESSAGE : "recoit"

    UTILISATEUR {
        int id PK
        string nom
        string prenom
        string email UK
        string mot_de_passe
        string telephone
        string role
        datetime date_inscription
    }

    PROPRIETE {
        int id PK
        string titre
        string description
        float prix
        string commune
        string quartier
        float superficie
        string type_bien
        string statut
        string panorama_url
    }

    TRANSACTION {
        int id PK
        string escrow_id UK
        string contract_address
        float montant_eth
        string statut
        string tx_hash
        datetime created_at
    }

    DOCUMENT {
        int id PK
        string type_document
        string chemin_fichier
        string ipfs_hash
        datetime date_upload
    }

    HISTORIQUE {
        int id PK
        string action
        string details
        datetime date_action
    }

    MESSAGE {
        int id PK
        text contenu
        datetime date_envoi
        boolean lu
    }
