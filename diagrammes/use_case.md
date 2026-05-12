graph TD
    subgraph Acteurs
        P[Propriétaire]
        A[Acheteur]
        AF[Agent Foncier]
        ADM[Administrateur]
    end

    subgraph "Kivu Market+ (Système)"
        UC1((S'authentifier))
        UC2((Soumettre une propriété))
        UC3((Consulter le catalogue))
        UC4((Lancer un achat - Escrow))
        UC5((Inspecter le bien))
        UC6((Certifier sur Blockchain))
        UC7((Gérer les agents))
        UC8((Arbitrer un litige))
        UC9((Suivre ses transactions))
        UC10((Uploader Documents))
    end

    %% Relations de base
    P --> UC2
    P --> UC9
    A --> UC3
    A --> UC4
    A --> UC9
    AF --> UC5
    ADM --> UC7
    ADM --> UC8

    %% Relations Include (obligatoires)
    UC2 -. "<<include>>" .-> UC1
    UC4 -. "<<include>>" .-> UC1
    UC2 -. "<<include>>" .-> UC10
    UC6 -. "<<include>>" .-> UC5
    UC6 -. "<<include>>" .-> UC1

    %% Relations Extend (optionnelles)
    UC8 -. "<<extend>>" .-> UC9
    UC4 -. "<<extend>>" .-> UC8
