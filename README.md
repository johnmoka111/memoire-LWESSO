# 🏡 KivuMarket+ — Plateforme de Sécurité Foncière à Bukavu

> **Mémoire de fin d'études — LWESSO**  
> Système de gestion et de sécurisation des transactions immobilières basé sur la Blockchain (GoChain/Ethereum) et la vérification terrain par agents certifiés.

---

## 📋 Table des Matières

1. [Description du Projet](#-description-du-projet)
2. [Architecture Technique](#-architecture-technique)
3. [Prérequis](#-prérequis)
4. [Installation Complète](#-installation-complète)
5. [Démarrage de l'Application](#-démarrage-de-lapplication)
6. [Identifiants de Connexion](#-identifiants-de-connexion)
7. [Fonctionnalités par Rôle](#-fonctionnalités-par-rôle)
8. [Workflow Complet](#-workflow-complet)
9. [API Endpoints](#-api-endpoints)
10. [Migration sur un Autre PC](#-migration-sur-un-autre-pc)
11. [Ce qui reste à faire](#-ce-qui-reste-à-faire)

---

## 📌 Description du Projet

**KivuMarket+** est une plateforme web académique qui résout le problème des fraudes foncières dans la région du Kivu (RDC) en combinant :

- ✅ **Validation physique terrain** par des agents certifiés
- ✅ **Ancrage blockchain** des titres fonciers (hash SHA-256 immuable)
- ✅ **Escrow sécurisé** pour les transactions immobilières
- ✅ **Notifications email** automatisées à chaque étape
- ✅ **Géolocalisation** interactive des biens (Leaflet.js)

---

## 🏗️ Architecture Technique

```
kivumarket/
├── backend/                    # API REST (PHP 8.2 Vanilla MVC)
│   ├── app/
│   │   ├── Controllers/        # Auth, Property, Transaction, Admin, Document
│   │   ├── Models/             # User, Property, Document, Transaction, Notification
│   │   ├── Services/           # BlockchainService, MailService
│   │   ├── Core/               # Router, Request, Response, Database, Model
│   │   └── Middlewares/        # AuthMiddleware, RoleMiddleware (JWT)
│   ├── config/
│   │   ├── app.php             # Constantes : DB, JWT, SMTP, Blockchain
│   │   └── KivuMarketEscrow.json  # ABI du Smart Contract
│   ├── routes/api.php          # Toutes les routes de l'API
│   ├── storage/uploads/        # Photos et documents uploadés
│   └── public/index.php        # Point d'entrée unique de l'API
│
├── frontend/                   # SPA React 19 + Tailwind CSS
│   ├── src/
│   │   ├── pages/              # Login, Register, Dashboard, PropertyDetail, Transactions...
│   │   ├── components/         # Sidebar, Navbar, Map...
│   │   └── config.js           # URL de l'API (API_URL)
│   ├── public/
│   │   ├── index.html          # Point d'entrée HTML
│   │   └── dist/               # Bundle JS/CSS compilé (app.js, app.css)
│   └── build.js                # Script de build (esbuild)
│
├── blockchain/
│   ├── contracts/KivuMarketTitle.sol  # Smart Contract Solidity
│   └── hardhat.config.js
│
├── database/schema.sql         # Schéma complet de la base de données
└── scratch/                    # Scripts utilitaires de diagnostic
```

**Stack :**
| Couche | Technologie |
|---|---|
| Frontend | React 19, Tailwind CSS, Framer Motion, Leaflet.js, Axios |
| Backend | PHP 8.2, JWT (firebase/php-jwt), PHPMailer, web3.php |
| Base de données | MySQL 8.0 |
| Blockchain | Solidity 0.8, Hardhat, GoChain Testnet |
| Serveur local | XAMPP (Apache + PHP + MySQL) |

---

## ⚙️ Prérequis

- **XAMPP** v8.2+ (Windows) — [xampp.org](https://www.apachefriends.org/)
- **Node.js** v18+ — [nodejs.org](https://nodejs.org/)
- **Git** — [git-scm.com](https://git-scm.com/)
- **Composer** — [getcomposer.org](https://getcomposer.org/)

---

## 🚀 Installation Complète

### Étape 1 — Cloner le dépôt

```bash
# Placer le projet dans le répertoire web de XAMPP
cd C:\xampp\htdocs

git clone https://github.com/johnmoka111/memoire-LWESSO.git kivumarket
```

### Étape 2 — Installer les dépendances backend (PHP)

```bash
cd C:\xampp\htdocs\kivumarket\backend
composer install
```

### Étape 3 — Configurer le fichier d'environnement

```bash
# Copier le fichier d'exemple
copy backend\.env.example backend\.env
```

Ouvrir `backend/.env` et vérifier :

```env
# Base de données (XAMPP par défaut)
DB_HOST=localhost
DB_NAME=kivumarket
DB_USER=root
DB_PASS=

# JWT
JWT_SECRET=KivuMarketSecretKey2026!

# Email SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application

# Blockchain (GoChain Testnet)
ETH_RPC_URL=https://testnet-rpc.gochain.io
CONTRACT_ADDRESS=0x...
ADMIN_WALLET=0x...
```

> **Note :** Pour le SMTP Gmail, vous devez activer un **"Mot de passe d'application"** dans les paramètres de sécurité Google (pas votre mot de passe habituel).

### Étape 4 — Créer la base de données

1. Démarrer XAMPP (Apache + MySQL)
2. Ouvrir **phpMyAdmin** : `http://localhost/phpmyadmin`
3. Créer une base de données nommée **`kivumarket`** (collation : `utf8mb4_general_ci`)
4. Importer le fichier schema :

```sql
-- Dans phpMyAdmin > kivumarket > Importer
Fichier : C:\xampp\htdocs\kivumarket\database\schema.sql
```

### Étape 5 — Créer le compte administrateur

```bash
cd C:\xampp\htdocs\kivumarket
C:\xampp\php\php.exe scratch\seed_admin.php
```

> Cela crée le compte `admin@kivumarket.cd` avec le mot de passe `Admin@Kivu2026!`

### Étape 6 — Installer les dépendances frontend

```bash
cd C:\xampp\htdocs\kivumarket\frontend
npm install
```

### Étape 7 — Compiler le frontend

```bash
cd C:\xampp\htdocs\kivumarket\frontend
npm run build
```

> Le bundle sera généré dans `frontend/public/dist/`

---

## ▶️ Démarrage de l'Application

### 1. Démarrer XAMPP

Ouvrir le **panneau de contrôle XAMPP** et démarrer :
- ✅ **Apache**
- ✅ **MySQL**

### 2. Accéder à l'application

| Interface | URL |
|---|---|
| **Frontend (Application)** | `http://localhost/kivumarket/frontend/public/index.html` |
| **API Backend** | `http://localhost/kivumarket/backend/public/index.php/api` |
| **PhpMyAdmin** | `http://localhost/phpmyadmin` |

---

## 🔑 Identifiants de Connexion

> **IMPORTANT :** Ces identifiants sont ceux de la base de données locale après import du `schema.sql` et exécution de `seed_admin.php`.

### Compte Administrateur

| Champ | Valeur |
|---|---|
| **Email** | `admin@kivumarket.cd` |
| **Mot de passe** | `Admin@Kivu2026!` |
| **Rôle** | `admin` |

### Comptes Agents (Terrain)

| Nom | Email | Mot de passe | Commune assignée |
|---|---|---|---|
| John Moka | `johnmoka2024@gmail.com` | `Agent@Kivu2026!` | Ibanda |
| TAL Hub | `tal.communities@gmail.com` | `Agent@Kivu2026!` | Kalundu |
| Blonde Tuliya | `blondetuliya@gmail.com` | `Agent@Kivu2026!` | Mulongwe |
| Lucien Amani | `johnfrederickbkm@gmail.com` | `Agent@Kivu2026!` | Goma |

### Compte Acheteur

| Champ | Valeur |
|---|---|
| **Email** | `luciusamani@gmail.com` |
| **Mot de passe** | `Buyer@Kivu2026!` |
| **Rôle** | `acheteur` |

> **Pour créer un compte propriétaire :** Utiliser le formulaire d'inscription sur `#/register`.

---

## 🎭 Fonctionnalités par Rôle

### 👑 Administrateur (`admin`)

- **Dashboard** : Statistiques globales (biens, agents, transactions, escrow actif en USD)
- **Gestion des Agents** : Créer, modifier, réinitialiser mot de passe, assigner une commune
- **Validations Foncières** : Voir tous les biens `en_attente` et assigner un agent terrain
- **Transactions** : Voir toutes les transactions escrow et résoudre des litiges (arbitrage)
- **Profil** : Modifier ses informations personnelles

### 🕵️ Agent Terrain (`agent`)

- **Dashboard** : Ses propres statistiques et biens de sa commune
- **Mes Missions** : Liste des biens `assigne` en attente de validation physique
- Pour chaque mission :
  - 📷 **Valider le bien** : Ajouter un lien panorama 360° → passe le bien en `valide` + ancrage blockchain
  - 🚨 **Signaler un litige** : Sélectionner parmi 20 motifs prédéfinis → passe en `rejete`
- **Profil** : Modifier ses informations

### 🏠 Propriétaire (`proprietaire`)

- **Soumettre un bien** : Formulaire complet (titre, localisation GPS, superficie, photos, titre foncier PDF)
- **Mes Biens** : Suivre le statut de ses annonces (`en_attente` → `assigne` → `valide`)
- **Transactions** : Voir les offres d'achat reçues

### 🛒 Acheteur (`acheteur`)

- **Marketplace** : Parcourir tous les biens validés avec carte interactive
- **Détail d'un bien** : Photos, panorama 360°, titre foncier, hash blockchain, géolocalisation
- **Initier un achat** : Créer une transaction escrow (modal de paiement MetaMask)
- **Mes Transactions** : Historique des transactions (`cree`, `libere`, `rembourse`)

---

## 🔄 Workflow Complet

```
1. PROPRIÉTAIRE soumet un bien
   └─> Statut : en_attente

2. ADMIN assigne un AGENT terrain
   └─> Statut : assigne
   └─> Email de notification envoyé à l'agent

3. AGENT effectue la visite physique
   ├─> Valide : ajoute panorama 360° → Statut : valide
   │   └─> Ancrage hash SHA-256 du titre foncier sur la blockchain
   │   └─> Le bien apparaît sur la marketplace publique
   └─> Rejette : motif de litige → Statut : rejete
       └─> Email envoyé au propriétaire avec le motif

4. ACHETEUR initie un achat
   └─> Création transaction Escrow (smart contract)
   └─> Statut : cree

5. ADMIN arbitre si litige
   ├─> libere : fonds envoyés au vendeur
   └─> rembourse : fonds retournés à l'acheteur
   └─> Hash de la transaction blockchain enregistré
```

---

## 🌐 API Endpoints

**Base URL :** `http://localhost/kivumarket/backend/public/index.php/api`

### Authentification (public)
```
POST /api/auth/login          # Connexion (retourne JWT)
POST /api/auth/register       # Inscription
```

### Biens Immobiliers
```
GET  /api/properties           # Liste publique des biens validés
GET  /api/properties/{id}      # Détail + photos + titres fonciers
POST /api/properties           # Créer un bien [auth: proprietaire/admin]
POST /api/properties/{id}/assign  # Assigner un agent [auth: admin]
```

### Agent
```
GET  /api/agent/missions             # Missions assignées à l'agent [auth: agent]
POST /api/agent/validate/{id}        # Valider un bien terrain [auth: agent]
POST /api/agent/reject/{id}          # Rejeter / signaler litige [auth: agent]
```

### Transactions Escrow
```
GET  /api/transactions               # Transactions de l'utilisateur [auth]
POST /api/transactions               # Créer une transaction escrow [auth: acheteur]
POST /api/transactions/resolve       # Résoudre litige [auth: admin]
```

### Administration
```
GET  /api/admin/properties           # Tous les biens [auth: admin]
GET  /api/admin/agents               # Liste des agents [auth: admin]
POST /api/admin/agents               # Créer un agent [auth: admin]
PUT  /api/admin/agents/{id}          # Modifier un agent [auth: admin]
POST /api/admin/agents/{id}/reset-password  # Reset MDP agent [auth: admin]
```

### Dashboard & Profil
```
GET  /api/dashboard/stats            # Statistiques [auth]
GET  /api/profile                    # Profil utilisateur [auth]
PUT  /api/profile                    # Mettre à jour profil [auth]
GET  /api/notifications              # Notifications [auth]
```

---

## 💻 Migration sur un Autre PC

Pour transférer l'application complète sur un autre ordinateur **sans perdre les données** :

### Option A — Copie Complète (Recommandée)

**Sur le PC source :**

**Étape 1 — Exporter la base de données**
```bash
# Via phpMyAdmin : kivumarket > Exporter > Format SQL > Télécharger
# OU via ligne de commande :
C:\xampp\mysql\bin\mysqldump.exe -u root kivumarket > C:\backup_kivumarket.sql
```

**Étape 2 — Copier les fichiers uploadés**
```bash
# Copier tout le dossier storage/uploads/
xcopy /E /I "C:\xampp\htdocs\kivumarket\backend\storage\uploads" "D:\backup_uploads"
```

**Étape 3 — Exporter les identifiants**
```bash
# Copier le fichier .env
copy "C:\xampp\htdocs\kivumarket\backend\.env" "D:\backup_env.txt"
```

---

**Sur le PC destination :**

**Étape 1 — Installer XAMPP, Node.js, Git, Composer** (voir Prérequis)

**Étape 2 — Cloner le dépôt**
```bash
cd C:\xampp\htdocs
git clone https://github.com/johnmoka111/memoire-LWESSO.git kivumarket
```

**Étape 3 — Installer les dépendances**
```bash
cd C:\xampp\htdocs\kivumarket\backend
composer install

cd ..\frontend
npm install
npm run build
```

**Étape 4 — Restaurer la base de données**
```bash
# 1. Créer la base "kivumarket" dans phpMyAdmin
# 2. Importer le backup SQL :
C:\xampp\mysql\bin\mysql.exe -u root kivumarket < C:\backup_kivumarket.sql
```

**Étape 5 — Restaurer les fichiers uploadés**
```bash
xcopy /E /I "D:\backup_uploads" "C:\xampp\htdocs\kivumarket\backend\storage\uploads"
```

**Étape 6 — Restaurer le fichier .env**
```bash
copy "D:\backup_env.txt" "C:\xampp\htdocs\kivumarket\backend\.env"
```

**Étape 7 — Démarrer XAMPP et tester**
- Lancer Apache + MySQL dans XAMPP
- Ouvrir : `http://localhost/kivumarket/frontend/public/index.html`

---

### Option B — Via Git (Sans données DB)

```bash
# Pull les dernières modifications
cd C:\xampp\htdocs\kivumarket
git pull origin master

# Réinstaller les dépendances
cd backend && composer install
cd ../frontend && npm install && npm run build

# Recréer la DB depuis le schéma
# (PhpMyAdmin → Importer database/schema.sql)

# Recréer l'admin
C:\xampp\php\php.exe scratch\seed_admin.php
```

---

### ⚠️ Points Critiques pour la Migration

1. **Le dossier `backend/storage/uploads/`** contient les photos et PDF des biens — il doit être copié manuellement (non versionné sur Git).
2. **Le fichier `backend/.env`** contient les secrets (SMTP, JWT) — il n'est pas sur Git pour sécurité. Toujours le copier manuellement.
3. **Les URLs dans la DB** (`file_url` dans la table `documents`) contiennent `http://localhost/kivu%20market/...` — si le chemin du projet change, il faudra mettre à jour ces URLs dans la DB.
4. **Le chemin XAMPP** doit rester identique : `C:\xampp\htdocs\kivumarket\` sinon les URLs de fichiers seront cassées.

---

## 🏗️ Ce qui reste à faire

### 🔴 Critique (pour production)
- [ ] **Intégration MetaMask côté frontend** : Actuellement la création de transaction escrow passe via l'API backend. Il faut intégrer `ethers.js` pour que l'acheteur signe la transaction depuis son wallet.
- [ ] **Déploiement du Smart Contract** : Le contrat `KivuMarketTitle.sol` doit être déployé sur le mainnet GoChain ou un testnet stable et son adresse mise dans `.env`.
- [ ] **HTTPS / SSL** : Pour la production, configurer un certificat SSL (Let's Encrypt).
- [ ] **Migrations DB** : Remplacer le fichier `schema.sql` monolithique par un système de migrations versionné.

### 🟡 Important (améliorations)
- [ ] **Oracle de prix ETH/USD** : Intégrer CoinGecko API pour convertir automatiquement les prix ETH en USD en temps réel (champ `prix_usd` actuellement vide).
- [ ] **Intégration cadastre** : Connecter l'API du cadastre congolais pour valider automatiquement les références foncières.
- [ ] **Upload photos sur Cloud** : Remplacer le stockage local (`storage/uploads/`) par Google Cloud Storage (GCS) pour la production (déjà configuré dans `app.php`).
- [ ] **Tests unitaires** : Aucun test automatisé n'existe pour le backend PHP.
- [ ] **Reset mot de passe** : L'email de reset fonctionne pour les agents, mais pas encore de route frontend `/reset-password` pour les utilisateurs réguliers.

### 🟢 Optionnel (UX)
- [ ] **Notifications temps réel** : Remplacer le polling par WebSockets (Ratchet PHP ou Node.js).
- [ ] **PWA (Progressive Web App)** : Ajouter un `service-worker.js` pour fonctionner offline.
- [ ] **Signature numérique** : Permettre aux propriétaires de signer électroniquement les documents.
- [ ] **Export PDF** : Générer des attestations de propriété en PDF depuis l'interface.
- [ ] **Multi-langue** : Support Français / Swahili / Anglais.

---

## 📊 État Actuel (Soutenance — Juillet 2026)

| Fonctionnalité | État |
|---|---|
| Authentification JWT multi-rôles | ✅ Fonctionnel |
| Soumission de biens + upload fichiers | ✅ Fonctionnel |
| Assignation d'agents par l'admin | ✅ Fonctionnel |
| Validation terrain + panorama 360° | ✅ Fonctionnel |
| Rejet avec motifs de litige | ✅ Fonctionnel |
| Ancrage blockchain SHA-256 | ✅ Fonctionnel (simulé si RPC offline) |
| Transactions Escrow (création/consultation) | ✅ Fonctionnel |
| Arbitrage admin (libérer/rembourser) | ✅ Fonctionnel |
| Notifications email (SMTP) | ✅ Fonctionnel |
| Carte interactive Leaflet | ✅ Fonctionnel |
| Panorama 360° (Pannellum) | ✅ Fonctionnel |
| Dashboard stats en temps réel | ✅ Fonctionnel |
| MetaMask (signature frontend) | ❌ Non implémenté |
| Oracle prix ETH/USD (CoinGecko) | ❌ Non implémenté |
| Cadastre DRC (API externe) | ❌ Non disponible |

---

## 👨‍💻 Auteur

**LWESSO** — Mémoire de fin d'études  
Université / Institit Supérieur — Promotion 2026  
Encadreur : [Nom de l'encadreur]

---

## 📄 Licence

Ce projet est développé dans le cadre académique. Tous droits réservés.

---

*KivuMarket+ — Sécuriser le patrimoine foncier du Kivu, une transaction à la fois.*
