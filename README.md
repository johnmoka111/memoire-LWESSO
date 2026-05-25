# KivuMarket+ : Plateforme de Sécurisation Foncière par Blockchain

KivuMarket+ est un écosystème technologique complet conçu pour apporter transparence, sécurité et fiabilité au marché immobilier et foncier du Sud-Kivu, particulièrement à Bukavu. En combinant une interface utilisateur premium, un backend robuste et la technologie blockchain, la plateforme vise à prévenir les conflits de spoliation et à garantir l'intégrité des transactions.

---

## 🚀 Niveau de Développement Actuel

Le projet est actuellement en phase **Bêta Avancée**. Les fondations technologiques (Frontend, Backend, Authentification, Cartographie) sont pleinement opérationnelles, tandis que l'intégration avancée de la blockchain (Mainnet) et des paiements réels reste en phase de test et de perfectionnement.

### ✅ Ce qui fonctionne (Implémenté)

- **Architecture de Base & Sécurité** : Système complet d'inscription et de connexion sécurisé par JWT. Gestion stricte des rôles : *Propriétaire, Acheteur, Agent de terrain, et Administrateur*.
- **Soumission des Biens** : Les propriétaires peuvent soumettre leurs offres avec téléchargement des preuves (titres fonciers PDF) et photos.
- **Cartographie Interactive (Leaflet)** : Carte interactive plein écran pour la sélection et la géolocalisation précise (coordonnées GPS) lors de la création de l'annonce.
- **Tableaux de Bord Spécifiques** :
    - *Admin* : Supervision des utilisateurs, des biens et assignation des agents.
    - *Agent* : Vue dédiée pour recevoir et traiter les missions de validation sur le terrain.
- **Centre de Notifications** : Suivi en temps réel des transactions et système d'alertes par e-mail via PHPMailer.
- **UI/UX Premium** : Design adaptatif (mobile-first), glassmorphisme, et micro-animations (Framer Motion).

### 🚧 Ce qui ne marche pas encore (Défis et Limites)

- **Exécution sur le Mainnet (Smart Contract)** : Les paiements et le blocage des fonds réels dans l'Escrow via MetaMask nécessitent des tests plus poussés pour être 100% stables.
- **Oracle de Devises (USD/CDF)** : La conversion dynamique des cryptomonnaies vers le Franc Congolais en temps réel doit être finalisée.
- **Upload des Visites 360°** : La compression et l'upload de lourds fichiers panoramiques vers Google Cloud Storage par les agents de terrain posent encore quelques défis de performance réseau.
- **Absence de Connexion Étatique** : Le système repose sur la vérification physique par l'agent. Il n'est pas encore connecté directement aux bases de données du Cadastre (Ministère des Affaires Foncières).

---

## 🛠️ Stack Technologique (Et pourquoi ces choix ?)

- **Frontend** : `React JS (v19)` & `Tailwind CSS 4` — Permet une interface SPA ultra-fluide et "mobile-first", vitale pour les utilisateurs en RDC.
- **Backend** : `PHP 8.3+ Vanilla (MVC pur)` sans framework — Démarche académique pour démontrer la maîtrise des fondamentaux (Routeur, PDO, sécurité manuelle).
- **Base de Données** : `MySQL 8.0` — Pour une fiabilité relationnelle éprouvée.
- **Blockchain** : `Solidity` & `GoChain/Polygon` — Cœur du projet, assure l'immuabilité des titres fonciers et la gestion sans confiance (trustless) des fonds via Escrow.
- **Outils Tiers** : `Leaflet` (Cartes), `Pannellum` (Visites 360°), `PHPMailer` (Emails).

---

## ⚙️ Guide d'Installation

### 1. Configuration Backend
1. Cloner le dépôt dans le dossier `htdocs` (XAMPP recommandé).
2. Importer le schéma SQL situé dans `database/schema.sql` (ou utiliser les scripts d'update locaux).
3. Configurer l'accès à la base de données dans `backend/config/app.php` (créer s'il n'existe pas).
4. S'assurer que le dossier `backend/storage/uploads/` est accessible en écriture.

### 2. Configuration Frontend
1. Naviguer dans le dossier `frontend` : `cd frontend`
2. Installer les dépendances : `npm install`
3. Lancer le serveur de développement : `npm run dev`

---
*Projet Académique (Mémoire) : Solution technologique pour la sécurité foncière à Bukavu.*
