# 🏘️ KivuMarket+ : Sécurisation Foncière par Blockchain (Bukavu, RDC)

**KivuMarket+** est une plateforme immobilière de nouvelle génération conçue spécifiquement pour le contexte de la ville de Bukavu. Elle lutte contre la spoliation foncière et les fraudes aux titres de propriété en utilisant la puissance de la Blockchain Ethereum.

---

## 🚀 Vision du Projet
À Bukavu, l'insécurité foncière (doubles ventes, faux titres) est un frein majeur au développement. KivuMarket+ résout ce problème par trois piliers :
1.  **L'Ancrage Immuable** : Chaque titre est converti en NFT (ERC-721). Son empreinte (Hash) est gravée à jamais sur la blockchain.
2.  **L'Oracle Agent** : Un agent certifié doit physiquement valider le terrain sur place pour débloquer la vente sur la blockchain.
3.  **Le Séquestre (Escrow)** : Les fonds sont bloqués de manière sécurisée et ne sont libérés au vendeur que lorsque toutes les conditions légales sont remplies.

---

## 🛠️ Architecture Technique
*   **Blockchain** : Solidity, Hardhat, Ethers.js, OpenZeppelin (ERC-721).
*   **Frontend** : React.js, **esbuild** (Bundler ultra-rapide), Tailwind CSS v4.
*   **Backend** : PHP (Architecture MVC), MySQL.
*   **Portefeuille** : MetaMask (Intégration Web3).

---

## 📦 Guide d'Installation (De A à Z)

Si vous changez de PC ou si un nouveau développeur rejoint le projet, suivez ces étapes dans l'ordre exact :

### 1. Prérequis Système
Installez les outils suivants :
*   [Node.js (v18+)](https://nodejs.org/)
*   [XAMPP](https://www.apachefriends.org/) (pour PHP et MySQL)
*   [Git](https://git-scm.com/)
*   [MetaMask Extension](https://metamask.io/) (dans votre navigateur)

### 2. Configuration de la Blockchain (Hardhat)
Le cœur du système se trouve dans le dossier `/blockchain`.
```bash
cd blockchain
npm install
```
**Pour lancer la simulation locale :**
1.  Ouvrez un terminal et lancez le nœud local : `npx hardhat node`
2.  Dans un autre terminal, déployez le contrat : `npx hardhat run scripts/deploy.js --network localhost`
3.  Copiez l'adresse du contrat affichée et mettez-la à jour dans `frontend/src/services/web3.ts`.

### 3. Configuration du Frontend (React + esbuild)
Le frontend utilise esbuild pour une vitesse de compilation instantanée.
```bash
cd frontend
npm install
npm run dev
```
L'application sera disponible sur `http://localhost:3001`.

### 4. Configuration du Backend (PHP)
1.  Démarrez Apache et MySQL via le panneau XAMPP.
2.  Importez le fichier `database/schema.sql` dans votre phpMyAdmin.
3.  Configurez vos accès base de données dans `backend/config/app.php`.

---

## 🧪 Simulation de Test (Scénario de Vente)

Pour tester le système sans dépenser d'argent réel :
1.  Connectez MetaMask au réseau local **Hardhat** (RPC: `http://127.0.0.1:8545`, Chain ID: `31337`).
2.  Importez l'un des comptes de test fournis par Hardhat (via sa clé privée).
3.  **Flux** : 
    *   **Vendeur** : Mint son titre (crée le NFT).
    *   **Acheteur** : Clique sur "Acheter via Escrow" et paie en GO/ETH.
    *   **Agent** : Inspecte le terrain et clique sur "Signer la certification" dans son dashboard.
    *   **Admin** : Clique sur "Libérer les fonds" pour terminer la vente.

---

## 📜 Licences & Sécurité
Ce projet utilise les standards de sécurité **OpenZeppelin**. Les contrats incluent des protections contre les attaques de réentrée (`ReentrancyGuard`) et une gestion stricte des droits (`Ownable`).

---
*Développé avec passion pour sécuriser le futur immobilier de Bukavu.*
