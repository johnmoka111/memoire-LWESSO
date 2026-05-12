# Diagramme 3 : Méthodologie SCRUM (KivuMarket+)

```mermaid
stateDiagram-v2
    [*] --> ProductBacklog : Besoins Utilisateurs
    state Sprint {
        ProductBacklog --> SprintPlanning
        SprintPlanning --> SprintBacklog
        SprintBacklog --> DailyScrum
        DailyScrum --> Development
        Development --> DailyScrum
    }
    Development --> SprintReview : Incrément (KivuMarket+)
    SprintReview --> SprintRetrospective
    SprintRetrospective --> ProductBacklog : Nouveaux Besoins
    SprintReview --> [*] : Version Stable
```

### Note Méthodologique :
Chaque fonctionnalité majeure (Tableau de bord, Gestion des Agents, Validations foncières) a été traitée comme un Sprint indépendant pour assurer une validation continue.
