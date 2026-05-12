graph TB
    subgraph "Poste Utilisateur (Client)"
        Nav["Navigateur Web (Chrome/Edge)"]
        MM["Extension MetaMask"]
        AppReact["Frontend React"]
    end

    subgraph "Infrastructure Serveur (XAMPP / Localhost)"
        PHP["Serveur Apache (PHP 8.2)"]
        MySQL[("Base de données MySQL")]
        IPFS["Stockage IPFS (Images/Docs)"]
    end

    subgraph "Réseau Blockchain (GoChain Testnet)"
        SC_Escrow["Smart Contract Escrow"]
        SC_NFT["Smart Contract KivuTitle (NFT)"]
        Nodes["Noeuds de Validation"]
    end

    %% Connexions Cote Client
    Nav --- AppReact
    AppReact --- MM

    %% Connexions Client vers Serveur
    AppReact -- "Requetes API REST (Axios)" --> PHP
    PHP -- "Pilote PDO" --> MySQL
    PHP -- "Upload Documents" --> IPFS

    %% Connexions vers Blockchain
    MM -- "Signatures & Transactions (RPC)" --> SC_Escrow
    MM -- "Appels Web3" --> SC_NFT
    SC_Escrow -- "Interaction" --> SC_NFT
    SC_NFT -- "Consensus" --> Nodes

    %% Styles
    style PHP fill:#777bb4,color:#fff
    style MySQL fill:#00758f,color:#fff
    style MM fill:#e2761b,color:#fff
    style Nodes fill:#222,color:#fff
