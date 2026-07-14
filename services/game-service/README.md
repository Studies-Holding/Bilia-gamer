# game-service — Port 5003

Catalogue des jeux (uploadés au format zip/statique), publication/dépublication par un admin, et le workflow d'**approbation parentale** avant qu'un enfant puisse télécharger/jouer à un nouveau jeu.

## Modèles

- **GameManifest** (`src/models/GameManifest.ts`) : métadonnées d'un jeu publié (nom, description, catégorie, tranche d'âge, compétences travaillées, `entryPoint`, statut publié/dépublié) — même esprit que `dev-template/bilia.config.json` côté créateur.
- **DownloadRequest** (`src/models/DownloadRequest.ts`) : une demande d'un profil enfant pour un jeu, avec statut (`pending`/`approved`/`rejected`/`cached`).

## Routes (`/api`)

| Méthode | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/games` | public | Catalogue des jeux publiés |
| GET | `/games/:id` | public | Détail d'un jeu |
| POST | `/games` | admin | Publie un nouveau jeu (upload via `uploadMiddleware`, multipart) |
| PATCH | `/games/:id` | admin | Met à jour les métadonnées d'un jeu |
| PATCH | `/games/:id/publish` | admin | Bascule publié/dépublié |
| POST | `/downloads/request` | requis | Un profil enfant demande à jouer à un jeu |
| GET | `/downloads/pending` | requis | Demandes en attente (vue parent) |
| GET | `/downloads/history` | requis | Historique des demandes |
| PATCH | `/downloads/:id/approve` | requis | Le parent approuve |
| PATCH | `/downloads/:id/reject` | requis | Le parent refuse |
| PATCH | `/downloads/:id/cached` | requis | Confirme que le jeu est bien mis en cache côté PWA enfant |
| GET | `/downloads/approved/:profileId` | requis | Jeux approuvés pour un profil |
| GET | `/downloads/status/:profileId/:gameId` | requis | Statut de la demande pour un couple profil/jeu |

Les fichiers statiques des jeux sont servis directement par Express sur `/games/*` (voir `src/app.ts`, dossier `storage/games/`, cache 30 jours) — en prod, Nginx reprend ce rôle (voir `gateway/README.md`).

## Variables d'environnement (`.env`)

```text
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bilia_game
JWT_SECRET=...
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
GAME_PORT=5003
LOG_LEVEL=info
# LOG_COLLECTOR_URL=...
```

## Lancer

```bash
npm run dev -w services/game-service
npm run build -w services/game-service
npm run start -w services/game-service
```

## Tests

```bash
npm test -w services/game-service
```

`src/__tests__/health.test.ts` : `GET /health` (200), `GET /api/downloads/pending` sans token (401), `POST /api/games` sans token (401 — avant même que `multer` ne traite le body), route inconnue (404 JSON).

## Architecture interne

- `src/app.ts` : Express (helmet avec `crossOriginEmbedderPolicy: false` pour ne pas bloquer le chargement de ressources cross-origin des jeux embarqués, cors, `httpLogger`, rate-limit 300 req/15min, `/games` statique, routes, 404) — testable sans DB.
- `src/index.ts` : connexion Mongo puis `app.listen(5003)`.
