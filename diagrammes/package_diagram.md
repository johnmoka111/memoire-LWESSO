graph TD
    subgraph "KivuImmobilier_Project"
        direction TB
        
        subgraph "Frontend"
            src[src/]
            pub[public/]
            comp[components/]
            pgs[pages/]
            srv[services/]
        end

        subgraph "Backend"
            core[app/Core/]
            ctrl[app/Controllers/]
            mod[app/Models/]
            cfg[config/]
        end

        subgraph "Blockchain"
            cnt[contracts/]
            tst[test/]
            scr[scripts/]
        end

        Frontend -- "consomme" --> Backend
        Frontend -- "interagit" --> Blockchain
        Backend -- "persiste" --> DB[(MySQL)]
    end
