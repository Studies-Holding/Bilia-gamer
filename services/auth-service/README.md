# auth-service — Port 5001

Comptes utilisateurs (parents), profils enfants, authentification JWT. Chaque parent peut créer plusieurs profils enfants ; chaque enfant se connecte via un **Code Magique** (8 caractères) plutôt qu'un mot de passe.

## Modèles

- **User** (`src/models/User.ts`) : `username`, `email`, `password` (hashé bcrypt), `role` (`parent`/`child`/`admin`), `magicCode` (généré auto), `subscriptionPlan` (`free`/`family`/`pro`), `settings` (thème, volume, langue, notifications).
- **Profile** (`src/models/Profile.ts`) : un profil enfant lié à un `User`. Contient `xp`, `level`, `rank`, `biCoins`, `badges`, `skills` (radar logique/réflexes/mémoire/calcul/créativité/langage), `ownedThemes`, `equippedAvatar/Border/Effect`, `dailyTimeLimit`, `ageGroup`.
  - `xpToLevel(xp)` : niveau = `⌊√(xp/100)⌋ + 1` (clampé à 0 minimum).
  - `xpToRank(xp)` : Novice → Initié (500) → Joueur (2000) → Expert (8000) → Maître (20000) → Légendaire (50000).
  - Ces deux fonctions sont pures et exportées séparément pour être testables sans Mongo.

## Routes (`/api/auth`)

| Méthode | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/register` | — | Crée un `User` + son premier `Profile` associé, renvoie un JWT |
| POST | `/login` | — | Email + mot de passe → JWT |
| POST | `/magic` | — | Code Magique (profil enfant) → JWT |
| GET | `/me` | requis | Utilisateur courant |
| GET | `/profiles` | requis | Liste des profils enfants du parent connecté |
| POST | `/profiles` | requis | Crée un profil enfant |
| PATCH | `/profiles/:id` | requis | Met à jour un profil (thème, avatar, limite de temps...) |

## Variables d'environnement (`.env`)

```text
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bilia_auth
JWT_SECRET=...           # à régénérer en production (64+ caractères aléatoires)
JWT_EXPIRES=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
PORT=5001
LOG_LEVEL=info
# LOG_COLLECTOR_URL=...  # optionnel, voir shared/README.md
```

## Lancer

```bash
npm run dev -w services/auth-service   # ts-node-dev --transpile-only
npm run build -w services/auth-service # tsc → dist/services/auth-service/src/index.js
npm run start -w services/auth-service # node dist/services/auth-service/src/index.js
```

## Tests

```bash
npm test -w services/auth-service
```

- `src/__tests__/profile.model.test.ts` : `xpToLevel`/`xpToRank` (fonctions pures, tous les paliers de rang, robustesse XP négatif).
- `src/__tests__/health.test.ts` : `GET /health` (200) et `GET /api/auth/me` sans token (401) — via `supertest` directement sur `src/app.ts`, sans connexion Mongo réelle.

## Architecture interne

- `src/app.ts` : Express (helmet, cors, `httpLogger`, rate-limit 300 req/15min, routes) — importable sans DB pour les tests.
- `src/index.ts` : connexion Mongo puis `app.listen(5001)`.
- `src/logger.ts` : instance du logger centralisé (`service: 'auth-service'`).
