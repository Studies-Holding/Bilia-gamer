# socket-service — Port 5004

Temps réel (Socket.io) : rooms parent/enfant, **couvre-feu** (`couvre-feu` / time guard), limites de temps de jeu quotidiennes, Quick Chat à liste blanche, défis entre profils, notifications.

## Concepts clés

- **Rooms** : chaque socket parent rejoint `parent:<userId>`, chaque socket enfant rejoint `child:<profileId>` (`join:parent` / `join:child`).
- **TimeConfig** (modèle Mongoose local) : par profil — limite quotidienne, limite week-end, couvre-feu (`curfewStart`/`curfewEnd`, format `HH:mm`), intervalle de pause, messages personnalisés.
- **DailyUsage** : minutes jouées par profil et par jour, incrémentées via un **heartbeat** (`time:heartbeat`, 1 appel = 1 minute).
- **`checkTimeGuard(profileId)`** : vérifie dans l'ordre (1) le couvre-feu via `isCurfewActive` puis (2) la limite quotidienne/week-end, et renvoie `{ allowed, reason?, message?, minutesLeft? }`.
- **`isCurfewActive(start, end, now)`** (`src/utils/timeGuard.ts`) : fonction pure, gère les plages traversant minuit (ex. `21:00 → 07:00`), inclusive sur l'heure de début / exclusive sur la fin. Extraite d'`index.ts` pour être testable indépendamment de Mongo/Socket.io.

## Événements Socket.io

| Client → serveur | Payload | Effet |
| --- | --- | --- |
| `join:parent` | `userId` | Rejoint la room parent |
| `join:child` | `profileId` | Rejoint la room enfant + vérification immédiate du temps (`time:lock`/`time:warning` si besoin) |
| `time:heartbeat` | `profileId` | +1 minute jouée aujourd'hui, re-vérifie le temps |
| `chat:send` | `{ toProfileId, messageId }` | Envoie un message de la liste blanche `QUICK_MESSAGES` (les messages hors liste sont silencieusement ignorés) |
| `challenge:send` | `{ toProfileId, gameId, score }` | Envoie un défi de score à un autre profil |

| Serveur → client | Quand |
| --- | --- |
| `time:lock` | Couvre-feu actif ou limite quotidienne atteinte |
| `time:warning` | Il reste 15/10/5/2 minutes (heartbeat) ou ≤10 min (à la connexion) |
| `chat:message` | Un ami a envoyé un message de la liste blanche |
| `challenge:in` | Un défi de score a été reçu |

`notifyParent(parentId, event, data)` est exporté pour être appelé par d'autres services (ex. `game-service` notifie un parent d'une nouvelle demande de téléchargement).

## Variables d'environnement (`.env`)

```text
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bilia_socket
JWT_SECRET=...
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
SOCKET_PORT=5004
LOG_LEVEL=info
# LOG_COLLECTOR_URL=...
```

## Lancer

```bash
npm run dev -w services/socket-service
npm run build -w services/socket-service
npm run start -w services/socket-service
```

## Tests

```bash
npm test -w services/socket-service
```

`src/__tests__/timeGuard.test.ts` : `isCurfewActive` — plage simple, plage traversant minuit (nuit et petit matin), hors couvre-feu, bornes inclusive/exclusive. Logique pure, aucune connexion Mongo/Socket.io nécessaire.

## Architecture interne

- `src/index.ts` : configure Express (helmet, cors, `httpLogger`) + Socket.io + les modèles `TimeConfig`/`DailyUsage`, puis connecte Mongo et démarre `httpServer.listen(5004)`. Contrairement aux 3 autres services, il n'y a pas de split `app.ts`/`index.ts` séparé (le serveur HTTP est indissociable de l'instance Socket.io) — seule la logique pure testable (`isCurfewActive`) a été extraite dans `src/utils/timeGuard.ts`.
