# BiLiA-V4

Plateforme parentale/enfant sous forme de **PWA** : un espace parent pour piloter le temps d'écran, les jeux autorisés et le suivi des progrès, et une **PWA enfant** installable où l'enfant joue à des mini-jeux éducatifs (calcul, logique, réflexes, mémoire, créativité, langage) tout en gagnant de l'XP, des rangs et des **BiCoins** à dépenser dans une boutique de thèmes/avatars.

Monorepo TypeScript organisé en microservices, avec un SDK partagé pour que des jeux tiers s'intègrent facilement à la plateforme (thèmes, scores, contrôle parental, capteurs caméra/voix).

## Sommaire

- [Architecture](#architecture)
- [Structure du repo](#structure-du-repo)
- [Démarrage rapide](#démarrage-rapide)
- [Workflow de dev](#workflow-de-dev)
- [Tests](#tests)
- [Logger centralisé](#logger-centralisé)
- [PWA](#pwa)
- [Modules](#modules)
- [Roadmap globale](#roadmap-globale)

## Architecture

```text
┌──────────────────────┐
│    gateway (Nginx)   │
│  vitrine / parent /  │
│   enfant / API / WS  │
└──────────┬───────────┘
           │
 ┌─────────┴────┬─────────────────┬──────────────┐
 ▼              ▼                 ▼              ▼
landing-page   apps/Bilia-Child  apps/Bilia-Parent
(vitrine)      (PWA Enfant)      (Dashboard)
 └──────────────┬─────────────────┘
                ▼
┌────────────────────────────────────────────────────────┐
│                  Microservices REST                    │
│               (chacun sa base MongoDB)                 │
├────────────────────────────────────────────────────────┤
│ auth   :5001 — comptes, profils, JWT                   │
│ core   :5002 — scores, XP, boutique, thèmes, analytics │
│ game   :5003 — catalogue jeux, approbations parentales │
│ socket :5004 — Socket.io temps réel, couvre-feu        │
└───────────────────────▲────────────────────────────────┘
                        │
┌───────────────────────┴────────────────────────────────┐
│                  shared (code commun)                  │
│ types · logger · middleware auth · SDK jeux · thèmes   │
│ libs front (Cookie / MediaPipe / Speech)               │
└────────────────────────────────────────────────────────┘

dev-template — Kit indépendant pour développer et tester un jeu tiers via tunnel HTTPS.
```

**Stack** : TypeScript partout · Express (services REST) · Socket.io (temps réel) · MongoDB (une base par service) · Winston (logs) · Nginx (gateway/reverse-proxy) · Jest + Supertest (tests) · npm workspaces (monorepo).

## Structure du repo

```text
BiLiA/
├── apps/
│   ├── Bilia-Child/       # PWA enfant — à initialiser (React + Motion conseillés)
│   └── Bilia-Parent/      # Dashboard parent — à initialiser
├── landing-page/          # Site vitrine — à initialiser
├── dev-template/          # Kit dev pour créer un jeu tiers + tunnel de test
├── gateway/                # Config Nginx (reverse-proxy + SSL)
├── services/
│   ├── auth-service/       # :5001 — comptes, profils, JWT
│   ├── core-service/       # :5002 — scores, XP/rang, BiCoins, boutique, thèmes, analytics
│   ├── game-service/        # :5003 — catalogue de jeux, upload, approbations parentales
│   └── socket-service/      # :5004 — Socket.io, couvre-feu, notifications temps réel
├── shared/                 # Code commun à tous les services et aux jeux
├── scripts/                # install-all / build-all / test-all / mongo-init
└── package.json             # Racine du monorepo (workspaces)
```

Chaque module a son propre `README.md` (comment il marche) et `ROADMAP.md` (ce qui reste à faire) — voir la table dans [Modules](#modules).

## Démarrage rapide

Prérequis : Node.js ≥ 18.18, npm ≥ 9, MongoDB (local ou Docker).

```bash
# 1. Installer toutes les dépendances (services + shared + dev-template)
npm run install-all

# 2. Copier les .env.example en .env dans chaque service (déjà fait en dev,
#    à refaire si tu régénères les secrets JWT en production)

# 3. Lancer les 4 microservices en parallèle
npm run dev
# ou un par un : npm run dev:auth / dev:core / dev:game / dev:socket

# 4. Lancer les tests
npm run test-all
```

Les fronts (`landing-page`, `apps/Bilia-Child`, `apps/Bilia-Parent`) sont volontairement laissés vides — à toi de les initialiser (Vite/React conseillé) puis de les ajouter au tableau `workspaces` du `package.json` racine une fois qu'ils ont leur propre `package.json`.

## Workflow de dev

- **1 service = 1 dossier = 1 port = 1 base Mongo.** Aucun état partagé entre services autrement que via HTTP/Socket.io ou `shared/`.
- Chaque service REST est scindé en deux fichiers :
  - `src/app.ts` — configuration Express pure (middlewares, routes), **sans** connexion DB ni écoute de port → c'est ce fichier qu'importent les tests (`supertest`).
  - `src/index.ts` — bootstrap : connexion Mongo puis `app.listen(...)`.
- Le code partagé (`shared/`) n'est **pas** compilé séparément : chaque service l'importe directement en TypeScript source via des chemins relatifs (`../../../shared/...`). C'est volontaire pour rester simple en dev (`ts-node-dev`), et ça fonctionne aussi en build (`tsc`) — voir la note sur `rootDir` dans `shared/README.md`.
- **Middleware d'auth mutualisé** : un seul `shared/middleware/auth.ts` (JWT), utilisé par les 3 services REST. Les 3 copies dupliquées ont été supprimées lors du refacto.

## Tests

```bash
npm run test-all        # lance jest dans shared + les 4 services
npm test -w services/auth-service   # un seul module
```

- `shared/__tests__/` : middleware d'auth, logger, registre de thèmes (fonctions pures, mocks Express).
- Chaque service a un `src/__tests__/health.test.ts` (supertest sur `app.ts`, sans dépendre d'une vraie Mongo) + des tests unitaires sur sa logique métier pure (ex: calcul XP/rang dans `auth-service`, couvre-feu dans `socket-service`).
- Détail des tests, module par module → voir chaque `README.md`.

## Logger centralisé

Tous les services utilisent le même logger (`shared/logger`, Winston) :

- `src/logger.ts` dans chaque service : `createLogger({ service: 'xxx-service' })`.
- `httpLogger(logger)` : middleware Express branché juste après `helmet()`/`cors()` — logue chaque requête (méthode, chemin, code, durée, `requestId`, `userId` si connecté).
- Sortie console (colorée en dev) + fichiers `logs/<service>-combined.log` et `logs/<service>-error.log`.
- Centralisation optionnelle : si `LOG_COLLECTOR_URL` est défini (ex: Loki, Elastic, collecteur maison), chaque log est aussi envoyé en HTTP — sinon ce transport est simplement ignoré.
- Plus aucun `console.log`/`console.error` dans les services backend.

## PWA

`apps/Bilia-Child` est la PWA principale (manifest + service worker, cf. `gateway/nginx.conf` qui sert `/manifest.webmanifest` et `/sw.js` avec les bons headers). `apps/Bilia-Parent` peut aussi être installable. Voir le `ROADMAP.md` de chaque app pour la checklist PWA (manifest, icônes, service worker, offline, installabilité).

## Modules

| Module | Rôle | README | Roadmap |
| --- | --- | --- | --- |
| `shared` | Types, logger, middleware auth, SDK jeux, thèmes, libs front | [README](shared/README.md) | [ROADMAP](shared/ROADMAP.md) |
| `services/auth-service` | Comptes, profils enfants, JWT | [README](services/auth-service/README.md) | [ROADMAP](services/auth-service/ROADMAP.md) |
| `services/core-service` | Scores, XP/rang, BiCoins, boutique, thèmes, analytics | [README](services/core-service/README.md) | [ROADMAP](services/core-service/ROADMAP.md) |
| `services/game-service` | Catalogue de jeux, upload, approbations parentales | [README](services/game-service/README.md) | [ROADMAP](services/game-service/ROADMAP.md) |
| `services/socket-service` | Temps réel, couvre-feu, notifications | [README](services/socket-service/README.md) | [ROADMAP](services/socket-service/ROADMAP.md) |
| `gateway` | Nginx reverse-proxy + SSL | [README](gateway/README.md) | [ROADMAP](gateway/ROADMAP.md) |
| `dev-template` | Kit de dev pour jeux tiers + tunnel HTTPS | [README](dev-template/README.md) | [ROADMAP](dev-template/ROADMAP.md) |
| `landing-page` | Site vitrine | [README](landing-page/README.md) | [ROADMAP](landing-page/ROADMAP.md) |
| `apps/Bilia-Child` | PWA enfant | [README](apps/Bilia-Child/README.md) | [ROADMAP](apps/Bilia-Child/ROADMAP.md) |
| `apps/Bilia-Parent` | Dashboard parent | [README](apps/Bilia-Parent/README.md) | [ROADMAP](apps/Bilia-Parent/ROADMAP.md) |

## Roadmap globale

Voir [ROADMAP.md](ROADMAP.md) à la racine pour les jalons transverses.
