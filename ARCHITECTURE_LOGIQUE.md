# Architecture Logique et Fonctionnement de KivuMobilier

Ce document détaille la logique métier, le rôle des différents acteurs et l'intégration de la technologie Blockchain pour la sécurisation foncière à Bukavu.

---

## 1. Les Acteurs et leurs Actions

### Le Propriétaire
Le propriétaire est le point de départ de la chaîne. Son action consiste à s'enregistrer sur la plateforme pour soumettre ses biens immobiliers. Il doit fournir non seulement les détails descriptifs et multimédias (photos, panoramas 360°), mais aussi les scans numériques de ses titres fonciers. Son bien reste dans un état "En attente" jusqu'à ce qu'un professionnel certifie les informations fournies.

### L'Acheteur
L'acheteur utilise la plateforme pour trouver des biens dont la sécurité juridique est garantie. Sa principale action, au-delà de la consultation, est l'initiation de l'achat. Pour sécuriser la transaction, il dépose le montant de la vente dans un Smart Contract (Escrow). Cette action prouve sa solvabilité et bloque les fonds de manière impartiale.

### L'Agent Foncier
L'agent foncier est un expert de terrain dont le compte est créé exclusivement par l'administrateur. Il effectue une double vérification : une descente physique sur le lieu du bien et une vérification de l'authenticité des documents auprès des services officiels des titres fonciers. Une fois convaincu, il déclenche l'ancrage de l'empreinte numérique du document sur la blockchain, rendant la certification immuable.

### L'Administrateur
L'administrateur est le garant de la gouvernance de la plateforme. Il est le seul habilité à intégrer de nouveaux agents fonciers dans le système. En cas de litige entre un acheteur et un vendeur lors d'une transaction, il agit comme arbitre. Selon les preuves présentées, il utilise ses droits sur le Smart Contract pour soit libérer les fonds vers le vendeur, soit rembourser l'acheteur.

---

## 2. Intégration Blockchain et Smart Contracts

La sécurité du système repose sur deux piliers technologiques majeurs.

### L'Ancrage de Données (Anchoring)
L'ancrage consiste à stocker l'empreinte numérique (Hash SHA-256) du titre foncier sur la Blockchain Ethereum. Cette méthode garantit l'intégrité absolue du document. Si le titre original est modifié, même de façon infime, son hash ne correspondra plus à celui qui a été ancré de manière permanente sur la blockchain, révélant immédiatement la fraude.

### Le Contrat d'Escrow (Tiers de Confiance)
Le Smart Contract est un programme autonome qui gère les fonds de la transaction sans intervention humaine. Il élimine le risque que le vendeur disparaisse avec l'argent avant le transfert légal de propriété. Les fonds sont bloqués dans le code et ne peuvent être débloqués que par une confirmation de réussite du transfert ou par une décision d'arbitrage en cas de problème.

---

## 3. Flux de Transaction Sécurisé

Le processus commence par l'enregistrement du bien par le propriétaire. L'agent foncier intervient ensuite pour la certification physique et numérique (ancrage blockchain). Une fois le bien certifié, l'acheteur peut engager ses fonds dans l'Escrow du Smart Contract. Les parties procèdent alors au transfert légal des documents physiques à la circonscription foncière. Enfin, après confirmation du succès du transfert, l'administrateur ou l'agent libère les fonds au vendeur. En cas d'échec, un remboursement est déclenché par l'arbitre.

---

## 4. Plan d'Exécution Progressif (Tâches)

Nous allons exécuter le projet suivant ces étapes incrémentales :

### Phase 1 : Administration et Gestion des Agents
- [x] **Tâche 1.1** : Création de la logique backend pour la création d'agents par l'Admin.
- [x] **Tâche 1.2** : Implémentation de l'algorithme de génération d'identifiants et mots de passe pour les agents.
- [x] **Tâche 1.3** : Interface Admin pour lister et créer ces agents.

### Phase 2 : Soumission et Certification
- [x] **Tâche 2.1** : Finalisation du formulaire de soumission de bien avec upload sécurisé des titres fonciers (Backend).
- [x] **Tâche 2.2** : Implémentation de la fonction d'ancrage dans `BlockchainService.php` (Liaison avec Web3.js/Ethers).
- [x] **Tâche 2.3** : Interface Agent pour examiner un dossier et déclencher l'ancrage blockchain.

### Phase 3 : Transaction et Escrow
- [x] **Tâche 3.1** : Déploiement du Smart Contract d'Escrow (Solidity).
- [x] **Tâche 3.2** : Intégration Web3 dans le Frontend pour permettre à l'acheteur d'interagir avec le contrat.
- [x] **Tâche 3.3** : Gestion des événements du contrat (Fonds bloqués, Fonds libérés) dans le Dashboard Admin pour l'arbitrage.

---
*Document mis à jour le 27 Avril 2026.*
