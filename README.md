# 🏡 Kivu Immobilier+ — Plateforme de Sécurité Foncière & Escrow Blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react)](https://react.dev/)
[![PHP](https://img.shields.io/badge/Backend-PHP_8.2-777BB4?logo=php)](https://www.php.net/)
[![Solidity](https://img.shields.io/badge/Blockchain-Solidity_^0.8.27-363636?logo=solidity)](https://soliditylang.org/)
[![MetaMask](https://img.shields.io/badge/Web3-MetaMask_Integration-F6851B?logo=metamask)](https://metamask.io/)

> **Mémoire de fin d'études — LWESSO**  
> Système de gestion, d'ancrage numérique et de sécurisation des transactions immobilières basé sur la Blockchain (Solidity / Hardhat / Ethereum Testnet) et la vérification terrain par agents certifiés.

---

## 📋 Table des Matières

1. [Description du Projet](#-description-du-projet)
2. [Technologies et Langages Utilisés](#-technologies-et-langages-utilisés)
3. [Guide : Déploiement et Connexion du Smart Contract](#-guide--déploiement-et-connexion-du-smart-contract)
4. [Guide : Lancement sur un Autre PC (Multi-OS & Navigateurs)](#-guide--lancement-sur-un-autre-pc-multi-os--navigateurs)
5. [Compatibilité Systèmes et Navigateurs](#-compatibilité-systèmes-et-navigateurs)
6. [Architecture Technique](#-architecture-technique)
7. [Identifiants de Connexion (Démo)](#-identifiants-de-connexion-démo)
8. [Fonctionnalités par Rôle](#-fonctionnalités-par-rôle)
9. [Workflow Général](#-workflow-général)
10. [Licence et Contribution](#-licence-et-contribution)

---

## 📌 Description du Projet

**Kivu Immobilier+** est une plateforme web moderne qui résout les problématiques de fraudes et litiges fonciers dans la région du Kivu (RDC) en combinant :

- 🛡️ **Certification terrain** : Audit et visite physique par des agents assermentés.
- 🔗 **Ancrage Blockchain** : Création d'un Titre Foncier Numérique immuable sous forme de NFT (ERC-721).
- 💰 **Paiement Escrow Séquestre** : Verrouillage des fonds via Smart Contract Solidity jusqu'à validation finale.
- 🌐 **Cartographie Interactive** : Géolocalisation des propriétés (Leaflet.js) et panoramas virtuels 360°.

---

## 💻 Technologies et Langages Utilisés

### 🎨 Frontend
- **Langages** : JavaScript (ES6+), HTML5, CSS3.
- **Framework & Libraries** : React 19, Tailwind CSS, Framer Motion (Animations), Lucide React (Iconographie), Leaflet.js (Cartographie).
- **Web3 Integration** : `ethers.js v6` pour l'interaction directe avec l'extension MetaMask.
- **Bundler** : Script de compilation ultra-rapide basé sur `esbuild` (`node build.js`).

### ⚙️ Backend
- **Langage** : PHP 8.2+ (Vanilla Architecture MVC RESTful API).
- **Sécurité & Authentification** : Jeton JWT (`firebase/php-jwt`), hachage de mots de passe `BCRYPT`.
- **Communications & Services** : PHPMailer (Notifications SMTP automatiques).

### ⛓️ Blockchain & Smart Contracts
- **Langage** : Solidity (`^0.8.27`).
- **Framework de développement** : Hardhat Node / Localhost (Port 8545).
- **Standard & Securité** : OpenZeppelin ERC721 (`ERC721URIStorage`, `ReentrancyGuard`, `Ownable`).

### 🗄️ Base de Données & Infrastructure
- **SGBD** : MySQL 8.0 / MariaDB.
- **Serveur Web Local** : XAMPP (Apache + PHP + MySQL).

---

## ⛓️ Guide : Déploiement et Connexion du Smart Contract

Ce guide explique comment compiler, déployer et raccorder le Smart Contract Solidity `KivuImmobilierTitle.sol` à l'application web et à votre portefeuille MetaMask.

### 1. Compilation du Smart Contract
Dans le répertoire `blockchain/` :
```bash
cd blockchain
npx hardhat compile
```

### 2. Démarrage du Nœud Blockchain Local
Lancez le réseau local Hardhat (qui simule la blockchain Ethereum) sur le port `8545` :
```bash
npx hardhat node
```
*Laissez ce terminal ouvert.* Il fournit 20 comptes pré-alimentés avec 10 000 ETH de test.

### 3. Déploiement du Contrat sur Localhost
Dans un nouveau terminal :
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```
Le script affichera l'adresse du contrat déployé :
`✅ Contrat déployé avec succès à l'adresse : 0x5FbDB2315678afecb367f032d93F642f64180aa3`

### 4. Configuration de l'Application Frontend
Ouvrez le fichier `frontend/src/config.js` et mettez à jour l'adresse du contrat si nécessaire :
```javascript
export const API_URL = "http://localhost/kivu_immobilier/backend/public/index.php/api";
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ADMIN_WALLET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
```
Reconstruisez ensuite le bundle frontend :
```bash
cd frontend
node build.js
```

### 5. Configuration de l'extension MetaMask
Dans votre navigateur :
1. Ouvrez l'extension **MetaMask** 🦊.
2. Allez dans le sélecteur de réseau > **Ajouter un réseau** > **Ajouter un réseau manuellement**.
3. Renseignez les paramètres suivants :
   - **Nom du réseau** : `Localhost 8545`
   - **URL RPC** : `http://127.0.0.1:8545` *(Attention : n'oubliez pas `http://`)*
   - **ID de chaîne (Chain ID)** : `31337`
   - **Symbole** : `ETH`
4. **Importer un compte acheteur** :
   - Dans MetaMask, cliquez sur **Importer un compte**.
   - Collez la clé privée du compte de test Hardhat #2 :
     `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
   - Vous obtiendrez un portefeuille de test alimenté en ETH pour valider les achats en séquestre.

---

## 🖥️ Guide : Lancement sur un Autre PC (Multi-OS & Navigateurs)

Suivez ces étapes pour installer et exécuter l'application **Kivu Immobilier+** sur n'importe quel nouvel ordinateur.

### 1. Prérequis Système
Installez les outils suivants sur le nouveau PC :
- **XAMPP** (PHP 8.2+, MySQL, Apache) — [ApacheFriends](https://www.apachefriends.org/)
- **Node.js** (v18+) — [Nodejs.org](https://nodejs.org/)
- **Git** — [Git-scm.com](https://git-scm.com/)
- **Composer** — [Getcomposer.org](https://getcomposer.org/)
- Extension Web3 **MetaMask** sur votre navigateur.

### 2. Cloner le Projet
Placez-vous dans le dossier racine de votre serveur web (ex: `C:\xampp\htdocs\` sur Windows ou `/var/www/html/` sur Linux/macOS) :
```bash
cd C:\xampp\htdocs
git clone https://github.com/johnmoka111/memoire-LWESSO.git kivu_immobilier
```

### 3. Configuration de la Base de Données
1. Lancez **Apache** et **MySQL** dans XAMPP.
2. Ouvrez **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Créez une nouvelle base de données nommée **`kivu_immobilier`** (Collation : `utf8mb4_general_ci`).
4. Importez le fichier SQL situé dans le projet : `database/schema.sql`.

### 4. Configuration Backend (PHP)
```bash
cd C:\xampp\htdocs\kivu_immobilier\backend
composer install
```
Créez le fichier `.env` à partir de l'exemple :
```bash
copy .env.example .env
```
Assurez-vous que les accès DB correspondent :
```env
DB_HOST=localhost
DB_NAME=kivu_immobilier
DB_USER=root
DB_PASS=
```

### 5. Compilation et Démarrage Frontend
```bash
cd C:\xampp\htdocs\kivu_immobilier\frontend
npm install
node build.js
```

### 6. Accès à l'Application
Ouvrez votre navigateur sur l'adresse :
```text
http://localhost/kivu_immobilier/frontend/public/index.html#/login
```

---

## 🌐 Compatibilité Systèmes et Navigateurs

### 💻 Systèmes d'Exploitation Supportés
- **Windows** : Windows 10 / Windows 11 (via XAMPP / WampServer).
- **macOS** : macOS Monterey, Ventura, Sonoma (via XAMPP pour Mac ou MAMP).
- **Linux** : Ubuntu 20.04+, Debian, Fedora, Arch Linux (via LAMP Stack).

### 🌐 Navigateurs Compatibles
- **Google Chrome** *(Recommandé)*
- **Brave Browser** *(Recommandé - Support Web3 natif)*
- **Microsoft Edge**
- **Mozilla Firefox**
- **Opera / Opera GX**

---

## 🏗️ Architecture Technique

```text
kivu_immobilier/
├── backend/                    # API REST (PHP 8.2 Vanilla Architecture MVC)
│   ├── app/
│   │   ├── Controllers/        # Auth, Property, Transaction, Admin, Document
│   │   ├── Models/             # User, Property, Document, Transaction
│   │   ├── Services/           # BlockchainService, MailService
│   │   └── Core/               # Router, Request, Response, Database
│   ├── config/                 # Paramètres DB, JWT, ABI Smart Contract
│   └── public/index.php        # Point d'entrée unique API
│
├── frontend/                   # Single Page Application (React 19)
│   ├── src/
│   │   ├── pages/              # Login, Dashboard, PropertyDetail, Transactions...
│   │   ├── components/         # Sidebar, Navbar, Map...
│   │   └── config.js           # Adresse API & Contrat Blockchain
│   ├── public/
│   │   └── dist/               # App compilée (app.js, index.js)
│   └── build.js                # Script de compilation ESBuild
│
├── blockchain/                 # Environnement Hardhat & Solidity
│   ├── contracts/              # KivuImmobilierTitle.sol (Smart Contract ERC-721)
│   └── scripts/deploy.js       # Script de déploiement automatisé
│
├── database/schema.sql         # Base de données initiale
├── LICENSE                     # Licence MIT
└── CONTRIBUTING.md             # Guide de contribution
```

---

## 🔑 Identifiants de Connexion (Démo)

| Rôle | Email | Mot de Passe |
|---|---|---|
| **Administrateur** | `admin@kivuimmobilier.cd` | `Admin@Kivu2026!` |
| **Agent Assermenté** | `johnmoka2024@gmail.com` | `Agent@Kivu2026!` |
| **Agent Terrain** | `tal.communities@gmail.com` | `Agent@Kivu2026!` |
| **Acheteur** | `luciusamani@gmail.com` | `Buyer@Kivu2026!` |

---

## 📄 Licence et Contribution

Ce projet est distribué sous la licence **MIT**. Consulter le fichier [LICENSE](LICENSE) pour plus de détails.  
Pour contribuer au projet, veuillez lire le guide [CONTRIBUTING.md](CONTRIBUTING.md).

---

*Kivu Immobilier+ — Transparence, Sécurité et Blockchain pour le patrimoine foncier du Kivu.*
