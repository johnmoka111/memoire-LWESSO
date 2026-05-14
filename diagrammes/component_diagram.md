graph LR
    subgraph "Frontend (React)"
        Pages["Pages & Composants UI"]
        API_Client["Client API Axios"]
        Web3_Prov["Provider Web3 - Ethers.js"]
    end

    subgraph "Backend (PHP/MVC)"
        Controllers["Controleurs API"]
        Models["Modeles de Donnees"]
        Core["Noyau & Reponse JSON"]
    end

    subgraph "Services Externes"
        Blockchain["Reseau Ethereum"]
        IPFS["Stockage IPFS"]
        MySQL[("Base de Donnees")]
    end

    Pages --> API_Client
    Pages --> Web3_Prov
    API_Client -- "Requêtes HTTP" --> Controllers
    Controllers --> Models
    Models --> MySQL
    Web3_Prov -- "RPC" --> Blockchain
    Controllers -- "Upload" --> IPFS
