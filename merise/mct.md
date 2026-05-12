graph TD
    %% Evenements et Operations
    E1[Arrivee d'une demande de vente] --> OP1{Traitement de Soumission}
    
    OP1 --> R1[OK: Annonce Creee]
    OP1 --> R2[KO: Dossier Incomplet]
    
    R1 --> E2[Demande d'Inspection]
    E2 --> OP2{Traitement de Validation}
    
    OP2 --> R3[Toujours: Rapport d'Inspection]
    R3 --> C1{Regle d'Emission}
    
    C1 -- "Si Conforme" --> R4[OK: Bien Certifie NFT]
    C1 -- "Si Non Conforme" --> R5[KO: Bien Rejete]
    
    R4 --> E3[Arrivee d'une offre d'achat]
    E3 --> OP3{Traitement d'Escrow Blockchain}
    
    OP3 -- "Succès Dépôt" --> R6[Fonds Bloqués]
    OP3 -- "Echec Dépôt" --> R7[Achat Annulé]
    
    R6 --> E4[Validation Finale Admin]
    E4 --> OP4{Traitement de Finalisation}
    
    OP4 --> R8[OK: Transfert Titre & Fonds]
    OP4 --> R9[Litige: Arbitrage Requis]
