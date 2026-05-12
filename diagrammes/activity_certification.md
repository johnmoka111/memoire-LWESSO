graph TD
    Start(( )) --> Soumission[Soumission du bien par le Proprietaire]
    Soumission --> VerifDoc{Verification Documents}
    
    VerifDoc -- Invalide --> Rejet[Rejet du dossier]
    VerifDoc -- Valide --> Assignation[Assignation d'un Agent par l'Admin]
    
    Assignation --> Descente[Descente sur terrain de l'Agent]
    Descente --> Inspection{Inspection du bien}
    
    Inspection -- Litige/Fraude --> RapportNeg[Rapport Negatif]
    Inspection -- Conforme --> Captures[Capture des photos 360 et Bornage]
    
    RapportNeg --> Notification[Notification au Proprietaire]
    Captures --> Upload[Televersement des donnees sur l'App]
    
    Upload --> Blockchain[Certification sur la Blockchain]
    Blockchain --> Mint[Emission du NFT Titre Foncier]
    
    Mint --> Catalogue[Publication dans le Catalogue public]
    Catalogue --> End(( ))
    
    Rejet --> Notification
    Notification --> End
