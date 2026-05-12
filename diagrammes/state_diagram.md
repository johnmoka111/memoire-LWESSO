stateDiagram-v2
    [*] --> EnAttente : Soumission par Proprietaire
    EnAttente --> Assigne : Admin choisit un Agent
    Assigne --> Valide : Inspection terrain OK
    Assigne --> Rejete : Documents ou terrain non conformes
    
    Valide --> EnVente : Mise en ligne automatique
    EnVente --> SousCompromis : Acheteur depose en Escrow
    
    SousCompromis --> Vendu : Libération des fonds
    SousCompromis --> EnLitige : Signalement probleme
    
    EnLitige --> Vendu : Arbitrage Admin (Release)
    EnLitige --> EnVente : Arbitrage Admin (Refund)
    
    Vendu --> [*]
    Rejete --> [*]
