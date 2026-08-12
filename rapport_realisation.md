# Rapport d'État de Réalisation - Projet Kivu Immobilier

*Ce document dresse un bilan technique et fonctionnel de l'état d'avancement du projet Kivu Immobilier, détaillant les implémentations achevées, l'architecture technologique et les défis restants selon le cahier des charges.*

---

## 1. Ce qui a été réalisé (Ce qui marche actuellement)

L'essentiel de la plateforme est opérationnel, avec une architecture robuste liant un front-end interactif à un back-end sécurisé.

- **Architecture de Base et Authentification** : Un système complet d'inscription et de connexion sécurisé par JWT (JSON Web Tokens) avec hachage des mots de passe (Argon2id). Le système gère strictement 4 rôles distincts : *Propriétaire, Acheteur, Agent de terrain, et Administrateur*.
- **Soumission et Gestion des Biens Immobiliers** : Les propriétaires peuvent soumettre leurs propriétés en remplissant un formulaire détaillé incluant le téléchargement des preuves (scans des titres fonciers au format PDF) et des photos classiques. 
- **Cartographie Interactive (Leaflet)** : Intégration d'une carte interactive plein écran permettant de placer et de récupérer les coordonnées GPS exactes du bien lors de la création de l'annonce, crucial pour le contexte de Bukavu.
- **Tableaux de Bord Spécifiques (Dashboards)** :
    - *Admin* : Un tableau de bord de supervision global offrant des statistiques fiables sur les utilisateurs, transactions, et propriétés, ainsi qu'une interface pour l'assignation des missions aux agents.
    - *Agent de terrain* : Une vue dédiée (AgentMissions) permettant aux agents de recevoir leurs ordres de mission pour la validation physique des biens.
- **Centre de Messages et Notifications** : Un système interne et externe fonctionnel. L'application notifie les utilisateurs des changements d'état de leurs biens (en attente, validé, rejeté) directement via l'interface et par emails transactionnels (via PHPMailer).
- **Interface Utilisateur (UI/UX)** : Le design premium est en place, utilisant des effets de glassmorphisme, des dégradés et une approche *mobile-first* indispensable pour l'accessibilité en RDC.

---

## 2. Comment ça marche (Le Workflow Actuel)

Le fonctionnement logique validé à ce stade est le suivant :
1. **Création** : Un propriétaire crée un compte, puis publie une offre de vente avec le titre foncier. Le statut du bien est mis en *« En attente »*.
2. **Assignation** : L'administrateur (ou le système) repère la nouvelle annonce et assigne la mission de vérification à un agent spécialisé sur la commune/zone du bien.
3. **Validation Terrain** : L'agent reçoit une notification, se rend sur place pour valider l'existence du bien, vérifier la conformité des documents et soumettre son rapport via son dashboard.
4. **Ancrage** : Techniquement, le backend prépare les données (hashage SHA-256 des documents) pour l'ancrage blockchain, assurant la traçabilité.

---

## 3. Technologies Utilisées et Choix Techniques

Les technologies ont été choisies avec une forte dimension académique (maîtrise des fondamentaux) et de performance :

- **Frontend : React JS (v19) & Tailwind CSS 4**
  - *Pourquoi ce choix ?* React permet une navigation SPA (Single Page Application) ultra-fluide. Tailwind CSS permet de concevoir rapidement une interface moderne, légère et complètement adaptative (responsive), ce qui est vital pour les connexions mobiles souvent instables au Sud-Kivu.
- **Backend : PHP 8.3+ Vanilla (Architecture MVC pure)**
  - *Pourquoi ce choix ?* Au lieu d'utiliser un framework lourd comme Laravel, l'utilisation de PHP Vanilla avec un routeur maison et PDO permet de démontrer la maîtrise des concepts fondamentaux du web, la sécurisation manuelle des routes, et garantit un code très performant (associé à OPcache).
- **Base de Données : MySQL 8.0**
  - *Pourquoi ce choix ?* Idéal pour stocker de manière relationnelle les utilisateurs, les rôles, les logs des annonces et assurer l'intégrité des données grâce aux clés étrangères.
- **Outils Spécifiques : Leaflet (Carte) & Pannellum (360°)**
  - *Pourquoi ce choix ?* Des bibliothèques open-source, légères et sans coûts de licence récurrents, permettant une visualisation spatiale très demandée dans l'immobilier moderne.
- **Blockchain : Solidity & Web3**
  - *Pourquoi ce choix ?* Pour le Smart Contract d'Escrow et le hachage cryptographique. C'est le cœur de l'innovation du projet visant à rendre toute falsification de document foncier impossible et à sécuriser les fonds de l'acheteur (tiers de confiance algorithmique).

---

## 4. Ce qui ne marche pas encore (Défis et Limites selon le Contexte)

Dans le cadre du développement global de Kivu Immobilier, certains modules restent à implémenter, à stabiliser, ou représentent des limites assumées :

- **Exécution réelle du Smart Contract d'Escrow avec des fonds** : Actuellement, la logique du contrat Solidity existe, mais l'intégration de bout en bout où un *Acheteur* connecte son portefeuille MetaMask et bloque de réels fonds cryptographiques sur le réseau principal (Mainnet) reste en phase expérimentale/test.
- **Oracle de Conversion de Devises (USD/CDF)** : La plateforme gère nativement de la cryptomonnaie pour l'Escrow, mais l'affichage précis en temps réel des taux de change vers le Franc Congolais ou le Dollar Américain nécessite encore la stabilisation d'un Oracle externe (ex: CoinGecko API) sans ralentir l'application.
- **Upload des Visites 360° (Google Cloud Storage)** : L'enregistrement et l'affichage des lourds panoramas 360° posent encore un défi de performance réseau. L'interface agent est prête, mais l'upload systématique sans erreur vers un cloud externe avec compression d'images (pour rester sous les 2 Mo) n'est pas encore à 100 % stable.
- **Absence de connexion avec le Cadastre Foncier de l'État** : Le système repose sur l'honnêteté et la vérification de l'agent de terrain. Kivu Immobilier n'est pas techniquement relié aux bases de données du Ministère des Affaires Foncières, ce qui maintient un facteur d'intervention humaine dans la chaîne de vérification (potentiel goulot d'étranglement ou risque résiduel de corruption de l'agent).
- **Arbitrage Centralisé** : En cas de litige, seul l'Administrateur peut trancher sur le contrat (remboursement ou libération des fonds). Un système plus décentralisé de type "multi-signatures" (Multisig/DAO) n'est pas encore programmé.
