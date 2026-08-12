# 👥 Utilisateurs du Système & 📜 Statut du Contrat Intelligent

Ce document récapitule les comptes d'utilisateurs par défaut pour les tests de la plateforme **KivuMarket+** ainsi que le statut du contrat intelligent (Smart Contract).

---

## 🔑 1. Utilisateurs, Rôles et Identifiants de Connexion

Voici le tableau récapitulatif des identifiants valides pour l'environnement local (base de données issue du fichier de schéma et des scripts d'initialisation) :

| Rôle | Nom & Prénom | Adresse Email | Mot de passe | Affectation / Détails |
| :--- | :--- | :--- | :--- | :--- |
| **Administrateur** (Super-Admin) | Admin KivuMarket | `admin@kivumarket.cd` | `Admin@Kivu2026!` | Gestion globale du système et arbitrage des litiges. |
| **Agent (Terrain)** | John Moka | `johnmoka2024@gmail.com` | `Agent@Kivu2026!` | Assigné à la commune de **Ibanda**. |
| **Agent (Terrain)** | TAL Hub | `tal.communities@gmail.com` | `Agent@Kivu2026!` | Assigné à la commune de **Kalundu**. |
| **Agent (Terrain)** | Blonde Tuliya | `blondetuliya@gmail.com` | `Agent@Kivu2026!` | Assigné à la commune de **Mulongwe**. |
| **Agent (Terrain)** | Lucien Amani | `johnfrederickbkm@gmail.com` | `Agent@Kivu2026!` | Assigné à la commune de **Goma**. |
| **Acheteur** | Willy Ngoma | `luciusamani@gmail.com` | `Buyer@Kivu2026!` | Rôle acheteur pour simuler des dépôts en séquestre. |

> 💡 **Note pour le rôle Propriétaire :** Pour tester en tant que propriétaire, vous pouvez simplement créer un compte via le formulaire d'inscription du site (`#/register`) ou modifier le rôle d'un utilisateur existant en base de données.

---

## ⛓️ 2. Statut du Contrat Intelligent (Smart Contract)

**Oui, le contrat intelligent est entièrement écrit et disponible dans le projet.**

### 📍 Localisation dans le projet
Le code source Solidity se trouve ici :  
📁 [KivuMarketTitle.sol](file:///c:/xampp/htdocs/kivumarket/blockchain/contracts/KivuMarketTitle.sol)

### ⚙️ Fonctionnalités du contrat intelligent
Le contrat intelligent, nommé `KivuMarketTitle`, est basé sur le standard **ERC-721 (NFT)** d'OpenZeppelin avec stockage d'URI personnalisé. Il gère de manière autonome :

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
