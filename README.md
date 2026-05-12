# KivuMarket+ : Plateforme de Securisation Fonciere par Blockchain

KivuMarket+ est un systeme d'information geographique et transactionnel concu pour resoudre les problemes de spoliation fonciere a Bukavu (RDC). Ce document detaille l'architecture technique, l'etat actuel du developpement et les etapes restantes pour la finalisation du projet.

---

## 1. Architecture Technique

### 1.1. Frontend
- Technologie : React.js avec Tailwind CSS v4.
- Bundler : esbuild (configure pour une compilation ultra-rapide).
- Gestion d'etat : Hooks React (useState, useEffect) et localStorage pour la persistence des jetons JWT.
- Communication : Axios (configure pour gerer le multipart/form-data pour les images).

### 1.2. Backend
- Technologie : PHP 8.2 (Architecture MVC personnalisee).
- Securite : Authentification par JSON Web Tokens (JWT).
- Base de donnees : MySQL (via PDO).
- Serveur Web : Apache (XAMPP) avec une configuration specifique pour le routage en sous-repertoire.

### 1.3. Stockage
- Les documents legaux et les photos sont stockes physiquement dans le dossier : `backend/storage/uploads/`.
- Les metadonnees et les chemins sont references dans la table `documents` de la base de donnees.

---

## 2. Etat Actuel du Travail (Termine et Operationnel)

### 2.1. Gestion des Utilisateurs et Agents
- Systeme d'inscription et de connexion fonctionnel (Proprietaires et Agents).
- Gestion des juridictions (Province, Ville, Commune) pour les agents.
- Dashboard d'administration permettant la creation et l'activation des comptes agents certificateurs.

### 2.2. Soumission de Proprietes
- Formulaire multi-etapes interactif.
- Upload multi-photos (jusqu'a 5 images avec apercu dynamique) fonctionnel.
- Upload de documents legaux (Titre foncier en PDF ou Image) fonctionnel.
- Gestion de la hierarchie geographique du Sud-Kivu integree.

### 2.3. Stabilisation Infrastructurelle (Critique)
- Resolution des erreurs reseau (Network Error) liees a la taille des fichiers via FormData.
- Configuration du routage Apache pour supporter les espaces dans les noms de dossiers (ex: "kivu market").
- Parametrage automatique des limites PHP (upload_max_filesize, post_max_size) pour supporter les photos haute resolution.

---

## 3. Ce qui ne marche pas encore (En cours de developpement)

### 3.1. Integration Blockchain de bout en bout
- Bien que le service `BlockchainService.php` existe, l'ancrage automatique (hashing) lors de la validation d'un agent n'est pas encore declenche depuis le frontend.
- La signature MetaMask pour les transactions de vente via le contrat Escrow doit etre finalisee sur la page des transactions.

### 3.2. Workflow de Validation Agent
- Le filtrage automatique des annonces par commune (un agent ne devrait voir que les biens de sa commune d'affectation) doit etre affine dans le controlleur.
- L'interface de signature de l'agent (Validations.jsx) est presente mais ne communique pas encore les donnees de certification a la blockchain.

### 3.3. Geolocation Interactive
- Le systeme utilise actuellement des coordonnees saisies manuellement. L'integration d'une carte interactive (Leaflet ou Google Maps) pour selectionner le point exact du terrain manque encore.

### 3.4. Notifications et Feedback
- Il n'y a pas encore de systeme d'alerte (Email ou In-app) pour prevenir un proprietaire quand son bien a ete valide ou rejete par un agent.

---

## 4. Maintenance et Diagnostic

### 4.1. Fichiers de configuration cles
- Frontend API : `frontend/src/config.js` (Contient l'URL de base vers le backend).
- Backend App : `backend/config/app.php` (Contient les parametres DB et Blockchain).
- Routage : `backend/public/index.php` et `backend/public/.htaccess`.

### 4.2. Diagnostic des erreurs
En cas d'erreur reseau persistante :
1. Verifier que le serveur Apache est lance sur le port 80.
2. S'assurer que le dossier `backend/storage/uploads/` dispose des droits d'ecriture.
3. Verifier le fichier `backend/request.log` (s'il est active) pour voir si la requete atteint le serveur.

---
Ce projet est dans une phase de stabilisation finale. Le pipeline de creation de contenu est operationnel, l'etape suivante consiste a boucler la boucle de confiance via la validation agent et l'ancrage blockchain.
