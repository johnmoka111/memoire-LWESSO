classDiagram
    class User {
        +int id
        +string nom
        +string email
        +string password
        +string role
        +login()
        +register()
    }

    class Property {
        +int id
        +int owner_id
        +string titre
        +string description
        +float prix
        +string status
        +string panorama_url
        +create()
        +update()
        +validate()
    }

    class Transaction {
        +int id
        +int property_id
        +int acheteur_id
        +string escrow_id
        +float montant_eth
        +string status
        +createEscrow()
        +finalize()
        +dispute()
    }

    class Document {
        +int id
        +int property_id
        +string file_path
        +string type
        +upload()
    }

    class BlockchainService {
        +mintTitle()
        +depositToEscrow()
        +finalizeSale()
        +adminResolve()
    }

    User "1" -- "*" Property : owns
    Property "1" -- "*" Document : has
    Property "1" -- "1" Transaction : involved in
    User "1" -- "*" Transaction : buys
    Property .. BlockchainService : reflected on
