graph TD
    subgraph "PROPRIETAIRE (Manuel)"
        A1[Saisir annonce]
        A2[Envoyer justificatifs]
    end

    subgraph "SYSTEME KIVU IMMOBILIER (Automatique)"
        S1{Verification Login}
        S2[Enregistrement DB]
        S3[Notification Admin]
        S5[Mint NFT Titre]
    end

    subgraph "ADMIN / AGENT (Humain + App)"
        H1[Assigner Agent]
        H2[Inspection Terrain]
        H3[Valider Certificat]
    end

    A1 --> S1
    S1 -- Valide --> A2
    A2 --> S2
    S2 --> S3
    S3 --> H1
    H1 --> H2
    H2 --> H3
    H3 --> S5
