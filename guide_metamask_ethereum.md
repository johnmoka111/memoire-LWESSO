# 🦊 Guide d'Intégration de MetaMask & Ethereum dans Google Chrome et KivuMarket+

Ce guide détaille pas à pas les étapes pour installer, configurer et connecter **MetaMask** ainsi qu'un réseau **Ethereum** (local ou de test) dans Google Chrome et dans l'application **KivuMarket+**.

---

## 📋 Table des Matières
1. [Installation de l'extension MetaMask dans Chrome](#1-installation-de-lextension-metamask-dans-chrome)
2. [Configuration du réseau Blockchain (Local ou Testnet)](#2-configuration-du-réseau-blockchain-local-ou-testnet)
3. [Importation de comptes de test avec des fonds (ETH)](#3-importation-de-comptes-de-test-avec-des-fonds-eth)
4. [Connexion de MetaMask à l'application KivuMarket+](#4-connexion-de-metamask-à-lapplication-kivumarket)
5. [Déploiement et interaction avec le Smart Contract](#5-déploiement-et-interaction-avec-le-smart-contract)

---

## 🦊 1. Installation de l'extension MetaMask dans Chrome

Pour que votre navigateur Chrome puisse communiquer avec la blockchain Ethereum, vous devez installer le portefeuille (wallet) MetaMask :

1. Ouvrez Google Chrome et rendez-vous sur le site officiel : [metamask.io](https://metamask.io/) ou directement sur le **Chrome Web Store**.
2. Cliquez sur **Ajouter à Chrome** pour installer l'extension.
3. Une fois installée, une icône de renard apparaît dans votre barre d'extensions (en haut à droite).
4. Cliquez sur l'icône de MetaMask et suivez les instructions de démarrage :
   * Choisissez **Créer un nouveau portefeuille**.
   * Définissez un mot de passe fort pour sécuriser l'extension localement.
   * **Important :** Notez soigneusement votre **Phrase Secrète de Récupération (12 mots)** sur un support physique sécurisé. Ne la partagez jamais.

---

## ⚙️ 2. Configuration du réseau Blockchain (Local ou Testnet)

Par défaut, MetaMask est connecté au réseau principal Ethereum (*Mainnet*), où les transactions coûtent de l'argent réel. Pour les tests et la soutenance, nous utilisons un réseau alternatif :

### Option A : Réseau local de test (Hardhat ou Ganache)
Si vous lancez une blockchain locale sur votre PC pour la démonstration :
1. Ouvrez MetaMask, cliquez sur le sélecteur de réseau (en haut à gauche, à côté de l'icône de profil).
2. Cliquez sur **Ajouter un réseau** > **Ajouter un réseau manuellement** (en bas de la liste).
3. Remplissez les champs suivants pour **Hardhat** (ou Ganache) :
   * **Nom du réseau** : `Localhost Hardhat`
   * **Nouvelle URL RPC** : `http://127.0.0.1:8545`
   * **ID de chaîne** : `31337` *(pour Hardhat)* ou `1337` *(pour Ganache)*
   * **Symbole de la devise** : `ETH`
4. Cliquez sur **Enregistrer**.

### Option B : Réseau de test public (Sepolia)
Pour utiliser un réseau de test public en ligne :
1. Dans MetaMask, accédez aux **Paramètres** > **Avancé**.
2. Activez l'option **Afficher les réseaux de test**.
3. Dans la liste des réseaux, sélectionnez **Réseau de test Sepolia**.

---

## 💰 3. Importation de comptes de test avec des fonds (ETH)

Pour effectuer des transactions, vos comptes doivent contenir des Ethers fictifs.

### Pour le réseau local (Hardhat/Ganache) :
Lorsque vous lancez la commande de test local `npx hardhat node` dans le terminal, Hardhat génère 20 comptes de test avec **100 ETH virtuels** chacun, ainsi que leurs **Clés Privées**.
1. Copiez l'une des clés privées générées dans votre terminal.
2. Ouvrez MetaMask, cliquez sur le menu déroulant des comptes (l'icône ronde de profil).
3. Cliquez sur **Ajouter un compte ou un portefeuille matériel** > **Importer un compte**.
4. Collez la **Clé Privée** copiée précédemment et cliquez sur **Importer**.
5. Vous disposez maintenant de 100 ETH de démonstration pour acheter ou vendre des biens immobiliers localement.

### Pour le réseau public Sepolia :
Si vous utilisez Sepolia, vous devez récupérer des ETH gratuits sur un "Robinet" (Faucet) :
1. Copiez votre adresse publique MetaMask (commençant par `0x...`).
2. Rendez-vous sur un site de Faucet tel que : [sepoliafaucet.com](https://sepoliafaucet.com/) ou [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia).
3. Collez votre adresse publique et demandez des fonds. Vous recevrez des fractions d'ETH sous quelques minutes.

---

## 🔌 4. Connexion de MetaMask à l'application KivuMarket+

L'application Web React intègre du code Javascript pour interagir avec l'extension MetaMask :

1. **Détection** : Dès le chargement de l'application, React vérifie si l'extension est présente en cherchant l'objet global `window.ethereum` injecté par MetaMask dans Chrome.
2. **Bouton de connexion** (ex: dans les Paramètres ou lors de l'achat) :
   * Au clic, l'application appelle la méthode :
     ```javascript
     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
     const userWalletAddress = accounts[0];
     ```
   * MetaMask ouvre une fenêtre pop-up dans Chrome vous demandant d'autoriser le site **KivuMarket+** à se connecter à votre compte.
3. **Validation** : Une fois la connexion acceptée, l'adresse de votre portefeuille Ethereum s'affiche dans votre profil de l'application.

---

## 📝 5. Déploiement et interaction avec le Smart Contract

Voici comment s'effectue la liaison finale de bout en bout pour une transaction immobilière sécurisée :

1. **Déploiement du contrat** :
   * Le contrat Solidity `KivuMarketTitle.sol` est déployé à l'aide de Hardhat.
   * L'adresse générée (ex: `0xAbCd...1234`) est enregistrée dans le fichier d'environnement `.env` du backend de l'application.
2. **Appel des fonctions en Escrow (Séquestre)** :
   * Lorsqu'un acheteur souhaite acheter un terrain validé, il clique sur **Acheter** (Initier l'Escrow).
   * L'application instancie le contrat intelligent dans le code React avec la bibliothèque `ethers.js` :
     ```javascript
     const provider = new ethers.BrowserProvider(window.ethereum);
     const signer = await provider.getSigner();
     const contract = new ethers.Contract(contractAddress, contractABI, signer);
     ```
   * Elle appelle ensuite la fonction payable du contrat :
     ```javascript
     const tx = await contract.depositEscrow(tokenId, { value: ethers.parseEther(prixBienEth) });
     await tx.wait(); // Attend la confirmation de la transaction sur la blockchain
     ```
   * MetaMask s'ouvre automatiquement dans Chrome pour demander à l'acheteur de **confirmer** le transfert d'ETH et le paiement des frais de gas.
3. **Mise à jour de la base de données** :
   * Une fois la transaction validée par la blockchain, le frontend envoie le hash de la transaction au backend pour mettre à jour le statut en base de données locale (`statut = 'cree'`).
