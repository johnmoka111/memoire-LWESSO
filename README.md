# KivuMarket+ : Plateforme de Securisation Fonciere par Blockchain

KivuMarket+ est un ecosysteme technologique complet concu pour apporter transparence, securite et fiabilite au marche immobilier et foncier du Sud-Kivu, particulierement a Bukavu. En combinant une interface utilisateur premium, un backend robuste et la technologie blockchain, la plateforme previent les conflits de spoliation et garantit l'integrite des transactions.

---

## 1. Architecture Technique Fondamentale

### 1.1. Frontend (React Ecosystem)
- Noyau : React.js avec une architecture basee sur les composants fonctionnels et les hooks.
- Interface : Design system personnalise exploitant le glassmorphisme, des degradés dynamiques et des micro-animations (Framer Motion).
- Cartographie : Integration profonde de Leaflet pour la geolocalisation precise des biens, incluant un mode d'exploration plein ecran.
- Communication : Axios avec intercepteurs pour la gestion des jetons JWT et le suivi des telechargements multi-fichiers.

### 1.2. Backend (Architecture MVC PHP)
- Noyau : PHP 8.2 avec un moteur de routage personnalise et une gestion stricte des types.
- Securite : Authentification JWT, hachage des mots de passe via Argon2id et middleware de protection des routes par role.
- Base de donnees : MySQL exploite via PDO avec des requetes preparees pour prevenir les injections SQL.
- Service de Messagerie : MailService integre pour l'envoi de notifications institutionnelles automatisees.

---

## 2. Fonctionnalites Majeures et Innovations

### 2.1. Geolocalisation et Cartographie Interactive
- Selection de position : Les utilisateurs peuvent placer precisement leur bien sur une carte interactive lors de la creation.
- Vue Immersive : Un mode "Plein Ecran" permet une navigation fluide sur la carte pour identifier les limites exactes des parcelles.
- Coordonnees GPS : Recuperation automatique de la latitude et de la longitude pour une precision millimetrique.

### 2.2. Centre de Messages et Notifications
- Notifications Internes : Un centre de messages dedie (Messages) permet aux utilisateurs de suivre le statut de leurs annonces en temps reel.
- Alertes Automatiques : Notifications generees lors de la validation terrain, du rejet d'une annonce (avec motif detaille) ou du changement d'affectation d'un agent.
- Notifications Email : Envoi de courriels professionnels sans emojis pour confirmer les activations de compte et les mises a jour critiques.

### 2.3. Workflow de Certification Agent
- Affectation Territoriale : Les agents sont assignes a des zones specifiques (Province, Ville, Commune) pour une expertise locale.
- Validation Terrain : Les agents inspectent les biens physiquement et ajoutent des preuves visuelles (panoramas 360 degres).
- Ancrage Blockchain : Chaque validation declenche un processus de hachage et d'ancrage des titres fonciers sur la blockchain GoChain pour une preuve d'existence immuable.

### 2.4. Dashboard d'Administration et Statistiques
- Monitoring Global : Tableau de bord resilient affichant le total des biens, agents, transactions et fonds sous sequestre.
- Gestion des Roles : Administration centralisee des proprietaires, acheteurs et agents avec une logique de normalisation des permissions.
- Resilience : Mecanismes de capture d'erreurs individuels pour garantir l'affichage des statistiques meme en cas de donnees manquantes dans certaines tables.

---

## 3. Guide d'Installation et Configuration

### 3.1. Requis Systemes
- Serveur : Apache (XAMPP recommande).
- Langage : PHP 8.1 ou superieur.
- Gestionnaire de paquets : Node.js et npm.
- Base de donnees : MySQL.

### 3.2. Configuration Backend
1. Cloner le depot dans le dossier htdocs.
2. Importer le schema SQL situe dans `database/schema.sql`.
3. Configurer les acces base de donnees dans `backend/config/app.php`.
4. S'assurer que le dossier `backend/storage/uploads/` est accessible en ecriture.

### 3.3. Configuration Frontend
1. Naviguer dans le dossier `frontend`.
2. Executer `npm install` pour installer les dependances.
3. Verifier l'URL de l'API dans `frontend/src/config.js`.
4. Lancer le serveur de developpement via `npm run dev`.

---

## 4. Securite et Gouvernance
- Immuabilite : Les documents critiques sont ancres cryptographiquement sur la blockchain.
- Protection des donnees : Toutes les interactions sensibles passent par des middlewares de verification de session.
- Transparence : Chaque modification d'affectation d'un agent terrain est notifiee a l'interesse par voie officielle.

---
Ce projet constitue une solution de rupture pour la gestion fonciere en Republique Democratique du Congo, alliant modernite numerique et rigueur juridique.
