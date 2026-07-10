flowchart LR
    User((Utilisateur)) --> Front[Frontend React]
    Front --> API[API PHP / Backend]

    subgraph Confiance ["Couche de Sécurité & Confiance"]
        API <--> DB[("MySQL : Données de base")]
        API <--> BC{{"Blockchain Ethereum (Solidity) : Certificats & Hash"}}
    end

    BC -.-> Ledger[Registre Immuable]

    style BC fill:#ffd54f,stroke:#f57f17
    style Ledger fill:#fff,stroke-dasharray: 5 5

# Diagramme 4 : Architecture de Confiance (KivuMobilier)