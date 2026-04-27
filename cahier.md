# KivuMarket+ — Cahier des Charges

> **Slogan** : *La technologie au service de la sécurité foncière à Bukavu.*

---

## 1. Présentation du Projet

- **Nom** : KivuMarket+
- **Slogan** : La technologie au service de la sécurité foncière à Bukavu.
- **Objectif général** : Digitaliser et sécuriser les transactions immobilières à Bukavu en combinant une plateforme web classique et la technologie blockchain pour lutter contre la spoliation foncière.
- **Innovation principale** : Utiliser un smart contract Solidity pour automatiser le séquestre (escrow), bloquer les fonds de l'acheteur jusqu'à la validation finale par un agent de terrain, et libérer les fonds uniquement après confirmation.

---

## 2. Acteurs (Rôles Utilisateurs)

| Rôle | Responsabilités |
|------|----------------|
| **Propriétaire** | Publie les annonces immobilières et upload les documents (titres fonciers). |
| **Acheteur** | Consulte les annonces, visualise les visites 360°, effectue le paiement via escrow. |
| **Agent de terrain** | Visite physiquement le bien, valide techniquement l'annonce et déclenche la libération des fonds via le smart contract. |

---

## 3. Fonctionnalités Principales

### Module Utilisateurs
- Inscription / Connexion sécurisée (3 rôles distincts).
- Gestion de profil avec adresse wallet (MetaMask).

### Module Immobilier & Immersif
- Publication d'annonces (titre, prix, commune, coordonnées GPS, description).
- Upload sécurisé de documents (PDF titres fonciers, photos).
- Intégration d'une visionneuse 360° avec **Pannellum** pour les panoramas capturés sur le terrain.

### Module Anti-Fraude (Blockchain)
- Génération d'un hash (SHA256) des documents importants et ancrage sur la blockchain.
- Système d'escrow via smart contract : les fonds sont bloqués jusqu'à validation par l'agent.
- Validation finale par l'agent de terrain qui déclenche la libération automatique des fonds.
- Enregistrement immuable des transactions et des hashes de documents.

---

## 4. Architecture Technique (Stack Validé)

### Backend
- PHP 8.x Vanilla (sans aucun framework comme Laravel).
- Architecture **MVC pure** (Models, Views, Controllers).
- PDO pour les interactions sécurisées avec la base de données.
- Web3.php pour interagir avec la blockchain depuis PHP.

### Frontend / UI
- **ReactJS** (avec TypeScript) pour une interface dynamique et rapide.
- **Tailwind CSS** pour le design moderne, épuré et responsive (priorité mobile).
- **Pannellum** pour l'affichage interactif des visites 360°.
- Axios pour consommer les API JSON du backend PHP.
- React Router pour la navigation.

### Base de Données
- **MySQL** (version 8.0+).
- Tables principales : `users`, `properties`, `documents`, `transactions`.

### Blockchain
- **Solidity** pour écrire le smart contract (escrow + validation agent).
- **Polygon** (testnet Amoy puis mainnet) pour des frais très bas.
- **MetaMask** ou WalletConnect pour que les utilisateurs signent les transactions.

### Stockage Fichiers
- **Google Cloud Storage** pour les fichiers volumineux (photos 360°, scans de titres fonciers).

### Outils & Infrastructure
- Composer pour les dépendances PHP légères.
- Git / GitHub pour le versionnage.
- Hardhat pour développer, compiler, tester et déployer le smart contract Solidity.

---

## 5. Exigences Non Fonctionnelles

- **Sécurité** : protection contre injections SQL (PDO), hachage des mots de passe (`password_hash`), protection XSS/CSRF.
- **Performance** : interface légère et adaptée aux connexions mobiles 3G/4G instables à Bukavu.
- **Accessibilité** : design responsive mobile-first.
- **Traçabilité** : toutes les actions critiques (validation, libération fonds) sont enregistrées sur la blockchain.

---

## 6. Phases de Développement

| Phase | Description |
|-------|-------------|
| **Phase 1** | Préparation environnement + structure MVC PHP + base MySQL. |
| **Phase 2** | Backend PHP (Authentification + CRUD Properties + Documents). |
| **Phase 3** | Frontend React + Tailwind + intégration Pannellum. |
| **Phase 4** | Développement du smart contract Solidity avec Hardhat (local). |
| **Phase 5** | Intégration Blockchain (hash documents + smart contract via Web3.php et MetaMask). |
| **Phase 6** | Configuration Google Cloud Storage pour les uploads. |
| **Phase 7** | Tests complets du flux (publication → visite 360° → paiement escrow → validation agent → libération fonds). |
| **Phase 8** | Déploiement (backend PHP, frontend React, smart contract sur Polygon, fichiers sur GCP). |

---

## 7. Contexte Académique (Mémoire UOB)

- Le choix du PHP Vanilla MVC est justifié par la volonté de maîtriser les fondamentaux (routeur maison, PDO, cycle HTTP) sans dépendre de frameworks "magiques".
- L'utilisation de React + Blockchain montre l'innovation et l'orientation vers les technologies modernes.
- Le projet répond directement au problème réel de spoliation foncière à Bukavu.