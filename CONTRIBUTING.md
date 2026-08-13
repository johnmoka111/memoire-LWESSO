# 🤝 Guide de Contribution — Kivu Immobilier+

Merci de votre intérêt pour la contribution au projet **Kivu Immobilier+** (Système de Sécurité Foncière & Escrow Blockchain).

---

## 📜 Code de Conduite

Nous visons un environnement accueillant, respectueux et professionnel. Toutes les contributions doivent respecter les normes de qualité académique et de sécurité informatique.

---

## 🛠️ Processus de Contribution

1. **Forker & Cloner le Dépôt** :
   ```bash
   git clone https://github.com/johnmoka111/memoire-LWESSO.git
   cd memoire-LWESSO
   ```

2. **Créer une Branche Fonctionnelle** :
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   # ou pour une correction de bug :
   git checkout -b fix/nom-du-bug
   ```

3. **Normes de Codage** :
   - **Frontend** : React 19, JavaScript ES6+, Vanilla CSS / Tailwind CSS. Utiliser le script `node build.js` dans `frontend/` avant chaque commit.
   - **Backend** : PHP 8.2+ conforme PSR-12, architecture MVC sans framework monolithique.
   - **Smart Contracts** : Solidity `^0.8.27`, contrats OpenZeppelin sécurisés.

4. **Messages de Commit** :
   Rédiger des messages explicites en français suivant le format Conventional Commits :
   - `feat(escrow): ajout de la vérification de solde`
   - `fix(auth): correction du jeton JWT expiré`
   - `docs(readme): mise à jour du guide de déploiement`

5. **Soumettre une Pull Request (PR)** :
   Pousser votre branche et ouvrir une PR sur le dépôt principal avec un résumé des modifications.

---

## 📄 Licence
En contribuant, vous acceptez que vos contributions soient distribuées sous la licence **MIT**.
