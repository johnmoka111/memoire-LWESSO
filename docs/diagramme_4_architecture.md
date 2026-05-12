# Diagramme 4 : Architecture de Confiance (KivuMarket+)

```mermaid
flowchart LR
    User((Utilisateur)) <--> Front[Frontend React]
    Front <--> API[API PHP / Backend]
    
    subgraph Confiance ["Couche de Sécurité & Confiance"]
        API <--> DB[(MySQL : Données de base)]
        API <--> BC{{Blockchain GoChain : Certificats & Hash}}
    end
    
    BC -.-> Ledger[Registre Immuable]
    
    style BC fill:#ffd54f,stroke:#f57f17
    style Ledger fill:#fff,stroke-dasharray: 5 5
```

### Transition :
Ce diagramme illustre comment l'approche agile a permis d'isoler la logique métier de la couche de confiance (Blockchain), préparant le terrain pour la phase de conception détaillée (Chapitre 3).
