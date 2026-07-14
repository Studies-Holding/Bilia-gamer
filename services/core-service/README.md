# core-service — Port 5002

Progression du joueur : scores, XP, BiCoins, boutique de thèmes/avatars, et rapports d'analyse pour les parents.

## Modèles

- **Activity** (`src/models/Activity.ts`) : historique des sessions de jeu par profil (score, jeu, durée, compétences travaillées) — sert de base aux analytics.
- **Wallet** (`src/models/Wallet.ts`) : solde de BiCoins par profil.
- **ShopItem** (`src/models/ShopItem.ts`) : articles achetables (thèmes, avatars, bordures, effets) avec leur prix en BiCoins.

## Routes (`/api`)

| Méthode | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/scores` | requis | Soumet un score pour une partie |
| POST | `/scores/sync` | requis | Synchronise un lot de scores (mode hors-ligne rattrapé) |
| GET | `/scores/leaderboard/:gameId` | public | Classement d'un jeu |
| GET | `/scores/history` | requis | Historique des scores du profil |
| GET | `/shop` | requis | Catalogue boutique |
| POST | `/shop/buy` | requis | Achat d'un article (débite le wallet) |
| PATCH | `/shop/equip` | requis | Équipe un article possédé (avatar/bordure/effet/thème) |
| GET | `/shop/wallet/:profileId` | requis | Solde BiCoins |
| GET | `/shop/inventory/:profileId` | requis | Articles possédés |
| GET | `/analytics/:profileId/report` | requis | Rapport global (temps de jeu, compétences, progression) |
| GET | `/analytics/:profileId/timeline` | requis | Chronologie des sessions |
| GET | `/analytics/:profileId/games` | requis | Répartition du temps par jeu |
| GET | `/themes` | public | Registre complet des thèmes (`shared/config/themes.config`) |
| GET | `/themes/:id` | public | Un thème (fallback sur le thème par défaut si id inconnu) |
| GET | `/themes/:id/css-vars` | public | Variables CSS du thème (utile pour un thème serveur-side ou un preview) |

## Variables d'environnement (`.env`)

```text
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bilia_core
JWT_SECRET=...
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CORE_PORT=5002
LOG_LEVEL=info
# LOG_COLLECTOR_URL=...
```

## Lancer

```bash
npm run dev -w services/core-service
npm run build -w services/core-service
npm run start -w services/core-service
```

## Tests

```bash
npm test -w services/core-service
```

`src/__tests__/health.test.ts` : `GET /health` (200), `GET /api/themes` (public, sans auth), `GET /api/shop` sans token (401), route inconnue (404 JSON) — via `supertest` sur `src/app.ts`, sans Mongo réelle.

## Architecture interne

- `src/app.ts` : Express (helmet, cors, `httpLogger`, rate-limit 500 req/15min, routes, 404 handler JSON) — testable sans DB.
- `src/index.ts` : connexion Mongo puis `app.listen(5002)`.
