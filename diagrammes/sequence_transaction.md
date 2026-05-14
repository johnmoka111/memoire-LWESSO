sequenceDiagram
    participant U as Acheteur
    participant F as Frontend (React)
    participant B as Backend (PHP)
    participant BC as Blockchain (Ethereum)
    participant O as Propriétaire

    U->>F: "Sélectionne un bien"
    U->>F: "Clique sur 'Acheter'"
    F->>BC: "depositToEscrow(propertyId, amount)"
    BC-->>F: "Transaction Hash (Succès)"
    F->>B: "storeTransaction(escrowId, txHash)"
    B-->>F: "Enregistré"
    
    Note over BC: "Fonds bloqués en Séquestre"

    Note right of BC: "--- Phase de Validation ---"
    
    B->>B: "Notifie l'Agent Foncier"
    Note over B,BC: "(Plus tard après inspection)"
    
    participant A as Agent
    A->>F: "Valide l'inspection"
    F->>BC: "certifyAndRelease(escrowId)"
    BC-->>F: "Transfert Propriété (NFT)"
    BC->>O: "Transfert des Fonds (ETH)"
    
    F->>B: "updateStatus(Vendu)"
    B-->>U: "Félicitations ! Vous êtes propriétaire."
