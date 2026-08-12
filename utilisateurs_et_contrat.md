# 👥 Utilisateurs du Système & 📜 Statut et Connexion du Contrat Intelligent

Ce document récapitule les comptes d'utilisateurs par défaut pour les tests de la plateforme **Kivu Immobilier+** ainsi que le statut du contrat intelligent (Smart Contract) et le guide d'utilisation/déploiement.

---

## 🔑 1. Utilisateurs, Rôles et Identifiants de Connexion

Voici le tableau récapitulatif des identifiants valides pour l'environnement local (base de données issue du fichier de schéma et des scripts d'initialisation) :

| Rôle | Nom & Prénom | Adresse Email | Mot de passe | Affectation / Détails |
| :--- | :--- | :--- | :--- | :--- |
| **Administrateur** (Super-Admin) | Admin Kivu Immobilier | `admin@kivuimmobilier.cd` | `Admin@Kivu2026!` | Gestion globale du système et arbitrage des litiges. |
| **Agent (Terrain)** | John Moka | `johnmoka2024@gmail.com` | `Agent@Kivu2026!` | Assigné à la commune de **Ibanda**. |
| **Agent (Terrain)** | TAL Hub | `tal.communities@gmail.com` | `Agent@Kivu2026!` | Assigné à la commune de **Kalundu**. |
| **Agent (Terrain)** | Blonde Tuliya | `blondetuliya@gmail.com` | `Agent@Kivu2026!` | Assigné à la commune de **Mulongwe**. |
| **Agent (Terrain)** | Lucien Amani | `johnfrederickbkm@gmail.com` | `Agent@Kivu2026!` | Assigné à la commune de **Goma**. |
| **Acheteur** | Willy Ngoma | `luciusamani@gmail.com` | `Buyer@Kivu2026!` | Rôle acheteur pour simuler des dépôts en séquestre. |

> 💡 **Note pour le rôle Propriétaire :** Pour tester en tant que propriétaire, vous pouvez simplement créer un compte via le formulaire d'inscription du site (`#/register`) ou modifier le rôle d'un utilisateur existant en base de données.

---

## ⛓️ 2. Statut du Contrat Intelligent (Smart Contract)

**Le contrat intelligent est entièrement à jour et disponible sous le nom `KivuImmobilierTitle`.**

### 📍 Localisation dans le projet
Le code source Solidity se trouve ici :  
📁 [KivuImmobilierTitle.sol](file:///c:/xampp/htdocs/kivu_immobilier/blockchain/contracts/KivuImmobilierTitle.sol)

### ⚙️ Fonctionnalités du contrat intelligent
Le contrat intelligent gère de manière autonome :

1. **Ancrage Immuable (Minting du Titre)** :
   * La fonction `mintTitle` permet de créer un NFT représentant un titre foncier avec son empreinte SHA-256 (`docHash`), les coordonnées GPS (`coordinates`) et l'adresse IPFS du document (`tokenURI`).
2. **Certification Physique (Oracle Agent)** :
   * Seuls les agents certifiés (`isCertifiedAgent`) peuvent appeler la fonction `verifyTitle` pour certifier l'existence réelle et physique du bien sur le terrain.
3. **Transaction Séquestre Fiduciaire (Escrow payable)** :
   * `depositEscrow` : L'acheteur dépose et bloque la somme requise en Ether (ETH) directement sur le contrat.
   * `releaseFunds` : Transfère le NFT à l'acheteur et envoie l'argent au vendeur tout en prélevant automatiquement des frais de plateforme de **2,5%** reversés à l'administrateur.
4. **Arbitrage Administratif (Résolution de litiges)** :
   * La fonction `adminResolve` permet à l'administrateur de trancher en cas de conflit pour soit :
     * Transférer les fonds au vendeur et le NFT à l'acheteur.
     * Rembourser intégralement l'acheteur.

---

## 🚀 3. Guide de Déploiement et Connexion au Smart Contract

Pour connecter le Smart Contract à la plateforme web Kivu Immobilier en local, suivez scrupuleusement ces étapes.

### Étape A : Lancer le Nœud de Test Local (Blockchain locale)
1. Ouvrez un terminal dans le dossier du projet blockchain :
   ```bash
   cd c:\xampp\htdocs\kivu_immobilier\blockchain
   ```
2. Lancez le nœud de test local Hardhat :
   ```bash
   npx hardhat node
   ```
   *Ce terminal doit rester ouvert.* Il va générer 20 comptes de test avec des adresses Ethereum et des clés privées contenant chacune 10000 ETH fictifs.

### Étape B : Compiler et Déployer le Smart Contract
1. Ouvrez un second terminal dans le même dossier :
   ```bash
   cd c:\xampp\htdocs\kivu_immobilier\blockchain
   ```
2. Compilez les contrats Solidity :
   ```bash
   npx hardhat compile
   ```
3. Exécutez le script de déploiement sur le réseau local :
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
4. Copiez l'adresse du contrat imprimée à la fin du déploiement (Exemple : `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`).

### Étape C : Configurer MetaMask dans votre Navigateur Chrome
1. Ouvrez l'extension **MetaMask**.
2. Cliquez sur la liste des réseaux (en haut à gauche) et ajoutez un **réseau personnalisé** :
   * **Nom du réseau** : `Hardhat Local`
   * **URL de RPC** : `http://127.0.0.1:8545`
   * **ID de chaîne** : `31337`
   * **Symbole de la devise** : `ETH`
3. **Importer les comptes de test** dans MetaMask :
   * Dans MetaMask, cliquez sur l'avatar du profil ➡️ **Importer un compte**.
   * Collez la clé privée de l'acheteur ou du vendeur listée dans le terminal où tourne `npx hardhat node` pour pouvoir faire des transactions avec des fonds réels locaux.
     * *Compte #0 (Admin)* : Clé privée `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
     * *Compte #1 (Seller)* : Clé privée de l'Account #1 listée par Hardhat.
     * *Compte #2 (Buyer)* : Clé privée de l'Account #2 listée par Hardhat.

### Étape D : Lier le Contrat à l'Application Kivu Immobilier
1. **Dans le Backend PHP** :
   * Ouvrez le fichier `backend/.env`.
   * Remplacez la valeur de `CONTRACT_ADDRESS` par la nouvelle adresse du contrat déployée :
     ```env
     CONTRACT_ADDRESS=0xVotreNouvelleAdresseDeContrat
     ```
2. **Dans le Frontend React** :
   * Ouvrez le fichier `frontend/src/config.js`.
   * Mettez à jour l'adresse par défaut :
     ```javascript
     export const CONTRACT_ADDRESS = localStorage.getItem('CONTRACT_ADDRESS') || "0xVotreNouvelleAdresseDeContrat";
     ```
   * Si vous avez déjà utilisé le site auparavant, videz le cache et le `localStorage` de votre navigateur (F12 ➡️ Application ➡️ Local Storage ➡️ Tout effacer) afin d'appliquer la nouvelle adresse de contrat.

### Étape E : Recompiler le Frontend React
Ouvrez un terminal dans `frontend/` et lancez la compilation :
```bash
cd c:\xampp\htdocs\kivu_immobilier\frontend
npm run build
```
Votre application est maintenant connectée à votre blockchain locale !
