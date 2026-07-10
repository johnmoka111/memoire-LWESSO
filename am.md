Voici le cahier des charges **enrichi et professionnel**, intégrant l’ensemble des améliorations que tu as demandées (rôle admin, gestion 360°, notifications, optimisation, tests UI, etc.). Il reprend la structure initiale en y ajoutant toutes les précisions techniques et fonctionnelles pour un projet robuste et académiquement solide.

---

**✅ CAHIER DES CHARGES COMPLET – KivuMobilier**  
**Version enrichie (Intégration des huit axes d’amélioration – Avril 2026)**  

---

### 1. Présentation Générale du Projet

**Nom** : KivuMobilier  
**Slogan** : *La technologie au service de la sécurité foncière à Bukavu.*  
**Contexte** : Spoliation foncière, falsification de titres, doubles ventes, opacité des transactions à Bukavu (Sud-Kivu, RDC).  
**Objectif général** : Plateforme hybride (web centralisée + blockchain) sécurisant le cycle complet d’une transaction immobilière avec escrow automatique, traçabilité immuable et visites immersives 360°.

---

### 2. Acteurs et Rôles (4 profils désormais)

| Rôle | Responsabilités |
|------|-----------------|
| **Propriétaire** | Publie l’annonce (titre, prix, description, photos normales), uploade les documents fonciers originaux (PDF). Suit l’état de la vente. |
| **Acheteur** | Consulte les annonces, visualise la visite 360° (fournie par l’agent après validation), initie le paiement en verrouillant les fonds dans l’escrow. |
| **Agent de terrain** | Reçoit une mission de validation physique. Se rend sur place, vérifie l’existence et la conformité du bien, capture les panoramas 360°, valide (ou rejette) l’annonce. Seul autorisé à appeler `validateByAgent()` sur le smart contract. |
| **Administrateur** *(nouveau)* | Gère les litiges, les blocages (agent absent, corrompu ou conflit d’intérêt). Peut débloquer les fonds, rembourser, ou désigner un nouvel agent. Accès à un dashboard de supervision complet. |

**Permissions strictes** : chaque rôle dispose d’un middleware backend et d’un dashboard dédié.

---

### 3. Fonctionnalités Détaillées (Modules revisités)

#### Module Utilisateurs
- Inscription / Connexion (email + mot de passe hashé `password_hash`/`password_verify`).
- Stockage de l’adresse wallet Ethereum (MetaMask) dans la table `users`.
- Sessions PHP sécurisées + JWT pour les API React.
- Récupération de mot de passe par token temporaire (email via PHPMailer).

#### Module Immobilier & Immersif (clarifié)
- **Dépôt d’annonce par le propriétaire** : titre, description, prix, commune, coordonnées GPS, statut `en_attente`. Photos classiques (JPEG/PNG) uploadées.
- **Mission de validation** : l’admin ou le système assigne un agent de terrain à une annonce en attente.
- **Visite physique par l’agent** : l’agent se rend sur place, vérifie les documents, l’existence du bien, et réalise une capture panoramique 360° (via appareil photo 360° ou smartphone). Il uploade ensuite le panorama sur Google Cloud Storage via le formulaire agent.
- **Affichage immersif** : le panorama 360° est intégré dans la page de l’annonce avec **Pannellum**. L’agent peut aussi ajouter des commentaires de vérification.
- **Transition d’état** : une fois l’agent valide, l’annonce passe en `valide` et la visite 360° devient visible publiquement.

#### Module Anti-Fraude (Blockchain – amélioré)
- **Hash des documents fonciers** : calcul SHA-256 et stockage dans la table `documents` + empreinte sur la blockchain (fonction `storeDocumentHash`).
- **Escrow intelligent (smart contract)** :
  - L’acheteur dépose les fonds en cryptomonnaie (fonction payable).
  - L’agent, après validation terrain, appelle `validateByAgent()`.
  - Le propriétaire ne peut retirer les fonds qu’après validation (fonction `releaseFunds`).
  - En cas de rejet, fonction `refund` (appelable par l’agent ou l’admin).
- **Mécanisme d’arbitrage (ADMIN)** :
  - Modificateur `onlyAdmin` ajouté au contrat.
  - Fonctions `adminResolve(uint escrowId, bool releaseToSeller)` :
    - Si `releaseToSeller == true` → libération vers le vendeur.
    - Sinon → remboursement à l’acheteur.
  - Permet de débloquer une transaction si l’agent est défaillant, absent, corrompu ou en conflit d’intérêt.
  - Événement Solidity `DisputeResolved` émis pour traçabilité.
- **Devise de l’escrow** : utilisation d’**Ethereum (ETH)** comme demandé pour la démonstration blockchain. Pour la visualisation utilisateur, le backend interroge un oracle de prix (ex. CoinGecko API) et affiche le montant en **dollars américains (USD)** et en **francs congolais (CDF)**. *Alternative possible pour le futur* : migrer vers un stablecoin (USDC) pour supprimer le risque de change, mais non requis pour la version académique.*

#### Module Notifications (nouveau)
- Utilisation de **PHPMailer** pour l’envoi d’emails transactionnels :
  - Inscription réussie, confirmation d’email.
  - Assignation d’une mission à un agent.
  - Validation / rejet d’une annonce.
  - Événements blockchain (EscrowCreated, FundsReleased, ValidatedByAgent) écoutés par le backend → déclenchement d’un email vers les parties concernées.
  - Alerte à l’admin en cas de litige ou inactivité prolongée.
- Files d’attente (optionnel) : si volume élevé, on utilisera une table `email_queue` et un cron pour l’envoi différé.

---

### 4. Architecture Technique Complète (Stack validée et enrichie)

**Backend**
- **PHP 8.3+**, architecture MVC Vanilla stricte.
- **Routeur maison** avec middlewares (auth, rôles).
- **PDO** + requêtes préparées.
- **Web3.php** pour interagir avec le smart contrat (écoute d’événements, appels aux fonctions de l’admin/agent).
- **PHPMailer** pour les emails.
- **Google Cloud Storage SDK** pour l’upload des documents et panoramas.
- **OPcache** activé et configuré pour améliorer les performances (cache des opcodes PHP en mémoire).

**Frontend / UI**
- **React 19** (TypeScript recommandé) avec **Tailwind CSS 4**.
- **React Router v7** pour la navigation SPA.
- **Axios** pour les API REST.
- **Pannellum** intégré via composant React pour les visites virtuelles.
- **MetaMask / WalletConnect** : connexion du wallet côté utilisateur (acheteur, agent, admin) pour signer les transactions (validation, dépôt).
- **Composants React** : pages publiques (liste annonces, détail avec 360°), dashboards par rôle, formulaires d’upload, visualisation de l’état de l’escrow.

**Base de données (MySQL 8.0)**
- `users` : + champs `role` (proprietaire, acheteur, agent, admin), `wallet_address`.
- `properties` : `status` (en_attente, valide, rejete, vendu), `agent_id`, `panorama_url` (lien vers le 360°).
- `documents` : `hash_blockchain`, `tx_hash`.
- `transactions` : `escrow_id` (uint256 du contrat), `etat` (créé, validé, libéré, remboursé).
- `notifications` : logs des emails envoyés.
- Index et clés étrangères sur toutes les jointures fréquentes.

**Blockchain (Solidity 0.8.27 + Hardhat)**
- Contrat `KivuMarketEscrow.sol` enrichi :
  - `struct Escrow { address buyer; address seller; uint amount; bool validated; bool released; ... }`
  - `mapping(uint => Escrow) escrows`
  - `modifier onlyAgent()`, `modifier onlyAdmin()`
  - `function createEscrow(...)`, `validateByAgent(...)`, `releaseFunds()`, `refund()`
  - `function adminResolve(uint escrowId, bool releaseToSeller) external onlyAdmin` → résolution des litiges.
  - Events : `EscrowCreated`, `ValidatedByAgent`, `FundsReleased`, `RefundIssued`, `DisputeResolved`
- Réseau : Sepolia (test) puis Ethereum mainnet.
- Déploiement via Hardhat, vérification sur Etherscan.

**Stockage Fichiers**
- Google Cloud Storage avec URLs signées.
- Compression des panoramas 360° (format JPEG 80%) pour limiter le poids sous 2 Mo.

**Tests**
- Backend : PHPUnit pour les modèles et contrôleurs.
- Smart contract : tests unitaires avec Hardhat + Mocha/Chai.
- Frontend : **Jest + React Testing Library** pour les composants critiques (dashboard, interaction wallet).
- Tests d’intégration : scénario complet (limité en temps académique, mais spécifié).

---

### 5. Exigences Non Fonctionnelles (mises à jour)

- **Performance** : OPcache activé, temps de réponse API < 800 ms, pages légères (< 2 Mo, panoramas optimisés).
- **Disponibilité** : Le smart contract étant décentralisé, l’escrow fonctionne même si le site est momentanément hors ligne.
- **Sécurité** : OWASP Top 10, validation côté serveur, protection CSRF/XSS, prepared statements. Clés privées jamais stockées sur le serveur.
- **Traçabilité** : tout changement d’état de l’escrow et toute résolution admin sont enregistrés sur la blockchain (immuabilité).
- **Notifications** : email obligatoire pour les étapes critiques.
- **Résilience** : le rôle admin garantit qu’une transaction ne reste jamais bloquée sans issue.

---

### 6. Phases de Développement (Planning révisé)

| Phase | Contenu | Durée |
|-------|---------|-------|
| Phase 1 | Environnement, MVC PHP, BDD MySQL | 1 sem. |
| Phase 2 | Auth, CRUD annonces, upload fichiers (Google Cloud), PHPMailer | 2 sem. |
| Phase 3 | Frontend React + Tailwind + Pannellum (UI immersive) | 3 sem. |
| Phase 4 | Smart contract Solidity (avec admin, events) + Hardhat tests | 2 sem. |
| Phase 5 | Intégration blockchain (Web3.php + React), oracle de prix (USD/CDF) | 2 sem. |
| Phase 6 | Dashboard Admin, arbitrage, notifications blockchain → email | 1 sem. |
| Phase 7 | Tests (PHPUnit, React, Hardhat) + correction + déploiement | 2 sem. |

---

### 7. Justification Académique (renforcée)

- **PHP Vanilla MVC** : maîtrise des fondamentaux.
- **React / Tailwind** : UI moderne et responsive, adaptée au réseau mobile congolais.
- **Solidity / Hardhat** : preuve de compréhension des smart contracts, gestion de l’escrow, mécanisme d’arbitrage.
- **Cloud Storage** : gestion professionnelle des médias lourds.
- **Notifications & rôles** : système complet et réaliste, démontrant une réflexion sur l’expérience utilisateur et la gouvernance.
- **Tests frontend** : valorisation des bonnes pratiques de qualité logicielle.

---

### 8. Limites assumées et perspectives d’évolution (transparence académique)

- La plateforme ne vérifie pas l’authenticité matérielle des documents originaux (solution future : collaboration avec le cadastre / notaire).
- L’escrow reste dépendant de la disponibilité du réseau Ethereum ; pour une adoption large, une L2 (Polygon, Arbitrum) ou un stablecoin serait préférable.
- La capture 360° est confiée à l’agent, ce qui nécessite un équipement minimal (smartphone compatible) et une formation.
- Le mécanisme d’arbitrage par un admin centralisé peut être amélioré par un multisig ou une DAO dans une version ultérieure.

---

### Conclusion
Ce cahier des charges intègre désormais **toutes les améliorations** demandées (rôle admin, clarification 360°, notifications PHPMailer, OPcache, tests React, gestion de la devise locale via oracle, etc.). Il est prêt à servir de base solide pour ton développement et la rédaction de ton mémoire.

Tu peux maintenant me partager ton canevas PDF pour que nous structurions ensemble la rédaction du document final.