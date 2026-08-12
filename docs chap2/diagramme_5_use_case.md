# Diagramme 5 : Cas d'Utilisation (Use Case) - Kivu Immobilier

```mermaid
useCaseDiagram
    actor "Visiteur" as V
    actor "Propriétaire / Client" as C
    actor "Agent Immobilier" as Ag
    actor "Administrateur" as Ad

    package KivuImmobilier_System {
        usecase "Rechercher et Consulter les Biens" as UC1
        usecase "Publier une Annonce (Offre)" as UC2
        usecase "Soumettre Documents (Titre/Plan)" as UC3
        usecase "Valider l'Existence Physique (Terrain)" as UC4
        usecase "Certifier sur la Blockchain (Hash)" as UC5
        usecase "Initier Transaction Escrow" as UC6
        usecase "Gérer les Utilisateurs et Rôles" as Ad1
    }

    V --> UC1
    
    C --> UC2
    C --> UC3
    C --> UC6
    
    Ag --> UC4
    
    Ad --> UC5
    Ad --> Ad1
    
    UC4 ..> UC5 : <<include>>
    UC2 ..> UC3 : <<include>>
```
