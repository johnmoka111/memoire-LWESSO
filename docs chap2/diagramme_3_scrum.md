---
config:
  layout: elk
---
stateDiagram-v2
    [*] --> ProductBacklog : Besoins Utilisateurs
    state Sprint {
        ProductBacklog --> SprintPlanning
        SprintPlanning --> SprintBacklog
        SprintBacklog --> DailyScrum
        DailyScrum --> Development
        Development --> DailyScrum
    }
    Development --> SprintReview : "Incrément (KivuMobilier)"
    SprintReview --> SprintRetrospective
    SprintRetrospective --> ProductBacklog : "Nouveaux Besoins"
    SprintReview --> [*] : "Version Stable"

# diagramme_3_scrum
