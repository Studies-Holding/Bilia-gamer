# shared — Code commun BiLiA-V4

Code partagé par les 4 microservices et par le SDK exposé aux jeux tiers. Importé directement en TypeScript source (pas de build séparé) via des chemins relatifs, ex. `import { createLogger } from '../../../shared/logger'`.

## Contenu

| Dossier | Rôle |
| --- | --- |
| `types/` | Types partagés : `IProfile`, `IJwtPayload`, événements Socket.io (`ClientToServerEvents`/`ServerToClientEvents`), `ApiOk`/`ApiErr`... et l'augmentation globale `Express.Request` (`user`, `requestId`) |
| `logger/` | Logger centralisé (Winston) — voir plus bas |
| `middleware/auth.ts` | `requireAuth` (vérifie le JWT) et `requireRole(...)` (restreint par rôle `parent`/`child`/`admin`) — utilisé par les 3 services REST |
| `config/themes.config.ts` | `THEMES_REGISTRY` (thèmes visuels de la boutique), `getTheme(id)`, `themeToCSSVars(theme)` (conversion palette → variables CSS, avec calcul RGB) |
| `sdk/bilia-sdk.ts` | SDK JS que les jeux embarqués (iframe) utilisent pour communiquer avec la PWA enfant (thème courant, scores, pause/reprise, MediaPipe, synthèse vocale...) |
| `lib/CookieManager.ts` | Gestion de cookies côté navigateur (préférences, sessions courtes) |
| `lib/MediaPipeService.ts` | Wrapper singleton autour de MediaPipe (mains/pose/visage) pour les jeux qui utilisent la caméra |
| `lib/SpeechService.ts` | Wrapper synthèse vocale + reconnaissance vocale (Web Speech API) |

## Logger centralisé

```ts
// service/src/logger.ts
import { createLogger } from '../../../shared/logger';
export const logger = createLogger({ service: 'mon-service' });
```

```ts
// service/src/app.ts
import { httpLogger } from '../../../shared/logger';
app.use(httpLogger(logger)); // juste après helmet()/cors()
```

- Sortie console colorée + `logs/<service>-combined.log` + `logs/<service>-error.log`.
- `LOG_LEVEL` (env, défaut `info`) et `LOG_COLLECTOR_URL` (optionnel, transport HTTP vers un collecteur externe type Loki/Elastic) sont lus automatiquement.
- `httpLogger` attribue un `requestId` (repris du header `x-request-id` ou généré) à chaque requête et logue méthode, chemin, code, durée, `userId`.

## SDK jeux (`sdk/bilia-sdk.ts`)

Instancié côté jeu embarqué (iframe) : `getTheme()`, `getAllThemes()`, `sendScore(score)`, `finishGame(payload)`, `saveState(state)`, `pause()`/`resume()`, `vibrate(pattern)`, `reportSkill(skills)`, `isAuthorized()`, `getDifficulty()`, plus des abonnements événementiels : `onThemeChanged`, `onPause`, `onResume`, `onDifficultyUpdate`, `onTimeLock`, `onHandDetected`/`onPoseDetected`/`onFaceDetected` (MediaPipe), `speak(text, lang, rate)`.

C'est la même base que le SDK simplifié fourni aux développeurs tiers dans `dev-template/src/bilia-sdk.ts`.

## Note technique : `rootDir` et build

`shared/` n'a pas de build/dist propre : chaque service le compile en même temps que son propre code (`tsc` sans `rootDir` restrictif). C'est volontairement simple pour un monorepo de cette taille — si `shared` grossit beaucoup, envisager des *TypeScript project references* (`composite: true`) pour un build incrémental séparé.

## Tests

```bash
npm test -w shared
```

- `__tests__/auth-middleware.test.ts` — `requireAuth`/`requireRole` avec des mocks `Request`/`Response` (token manquant, invalide, valide ; rôle insuffisant/correct).
- `__tests__/logger.test.ts` — `createLogger` (meta par défaut, niveau explicite, transport HTTP conditionnel à `LOG_COLLECTOR_URL`).
- `__tests__/themes.config.test.ts` — `getTheme` (thème existant / fallback), `themeToCSSVars` (conversion hex → rgb).
