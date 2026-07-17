# Modules transverses : `shared`, `bilia-sdk`, `contracts`

**Phase :** MVP · **Type :** packages (pas de service/port propre)

Ces packages du monorepo factorisent le socle commun et évitent aux services et aux créateurs de redévelopper l'infrastructure.

---

## A. `shared` : socle commun, en deux packages

### Responsabilité

Fournir le socle commun aux services (backend) et aux frontends (UI), **sans coupler les deux mondes** dans un seul package. `shared/` est un dossier conteneur (matché par `pnpm-workspace.yaml: shared/**`) qui héberge deux packages npm distincts :

- **`@shared/core`** (`shared/core/`) — logger, middleware, types, erreurs, taxonomies, thèmes, utilitaires. Consommé uniquement par `services/*` (Node).
- **`@shared/ui`** (`shared/components/`) — bibliothèque de composants React (shadcn/ui) + hooks + `globals.css`. Consommé uniquement par `apps/*` (Vite/React).

> **Pourquoi ce découpage (décidé le 2026-07-17, cf. AFG-DT-004 §2) :** un service Express n'a aucune raison d'installer React/Tailwind pour obtenir son logger, et une app Vite n'a aucune raison d'installer Winston/Express pour obtenir un bouton. Le nom de package `@shared/ui` et le chemin `shared/components` sont déjà ceux utilisés par les trois apps scaffoldées (`apps/*/package.json` → `"@shared/ui": "workspace:*"`, résolu vers `shared/components` dans `pnpm-lock.yaml`) : c'est la contrainte de fait qui a tranché le nommage.

### Contenu — `@shared/core`

- `logger/` : Winston + `httpLogger` (meta service-name, corrélation `requestId`).
- `middleware/` : `auth.ts` (source unique, dédupliquée), erreurs, validation.
- `types/` : types de domaine partagés + DTO.
- `errors/` : hiérarchie d'erreurs normalisée.
- `taxonomies/` : taxonomie des jeux + référentiel des compétences (source de vérité).
- `themes/` : `THEMES_REGISTRY` + génération de variables CSS (consommé côté build par `@shared/ui` pour produire `globals.css`, et côté API par les services qui exposent la config de thème).
- `utils/` : utilitaires purs (ex. `timeGuard` si mutualisé), idempotence, dates.

### Contenu — `@shared/ui`

- `components/` : bibliothèque de composants (basés sur shadcn/ui) utilisables par les applications.
- `hooks/` : ensemble de hooks consommés par toutes les applications.
- `globals.css` : styles de base + variables CSS générées depuis `THEMES_REGISTRY` (`@shared/core`).
- `lib/utils.ts` : helpers (ex. `cn`) requis par les composants shadcn.

### Arborescence

```text
shared/
├── core/
│   ├── src/{logger/, middleware/, types/, errors/, taxonomies/, themes/, utils/}
│   ├── tests/{logger.test.ts, themes.config.test.ts}
│   └── package.json · README.md        # @shared/core
├── components/
│   ├── src/{components/{button.tsx, card.tsx, ...}, hooks/{useStorage.ts, useProfile.ts, ...}, lib/utils.ts, globals.css}
│   └── package.json · README.md        # @shared/ui
```

### Roadmap

1. `@shared/core` : logger + httpLogger + middleware auth (source unique) + types/erreurs normalisés.
2. `@shared/core` : taxonomies (jeux + compétences) comme source de vérité.
3. `@shared/core` : `THEMES_REGISTRY` + génération CSS + tests.
4. `@shared/ui` : `globals.css` (consomme la génération CSS de `@shared/core`) + `lib/utils` + premiers composants (button, card) + hooks de base.

---

## B. `bilia-sdk` : SDK client des jeux

### Responsabilité

Permettre à un créateur de se concentrer sur la logique de son jeu ; toutes les fonctionnalités communes (compte, partie, sauvegarde, paiement, rendu, réseau temps réel) sont fournies par la plateforme via le SDK.

### Périmètre par phase

- **MVP : services plateforme :** identité joueur (id, avatar, âge si autorisé, langue, pays), gestion de partie (create/join/leave/resume), sauvegardes, paiement (vendre/débloquer/objets/Jetons), notifications.
- **MVP : moteur (amorce, AFG-DT-005) :** abstraction **rendu Babylon.js** pour les jeux 3D, abstraction **réseau** (Socket.io tour-par-tour, geckos.io pour les jeux d'action), **snapshot interpolation**, schéma binaire.
- **Phase 2 :** abstraction **physique** (Havok par défaut / Rapier en option déterministe), prédiction/réconciliation, succès, trophées, classements, amis, chat, tournois, analytics, localisation, packs culturels.
- **Phase 3 :** IA, Égaliseur de niveau, Mode Griot, taxonomie, IDC, traduction automatique, assistant de conception, équilibrage, détection des compétences.

### Arborescence

```text
sdk/bilia-sdk/
├── src/
│   ├── index.ts
│   ├── client.ts                 # config, auth, transport
│   ├── engine/                   # briques moteur optionnelles (AFG-DT-005)
│   │   ├── render/babylon.ts     # abstraction Babylon.js (jeux 3D)
│   │   ├── physics/              # havok.ts (défaut) · rapier.ts (option) : P2
│   │   ├── net/                  # socket.ts · geckos.ts · snapshot.ts · schema.ts
│   │   └── loop.ts               # boucle client (prédiction/interp., jeux d'action)
│   ├── modules/                  # services plateforme
│   │   ├── player.ts · session.ts · save.ts
│   │   ├── payment.ts · notifications.ts
│   │   ├── achievements.ts · leaderboard.ts   # P2
│   │   ├── griot.ts · idc.ts · equalizer.ts   # P3
│   ├── types/
│   └── utils/
├── tests/
├── package.json · README.md · ROADMAP.md
```

### Roadmap

1. Client (auth/transport) + modules player/session/save + paiement (Jetons/achats) + notifications.
2. Abstraction rendu Babylon + réseau (socket + geckos) + snapshot interpolation, pour les jeux qui en ont besoin.
3. (P2) Abstraction physique (Havok/Rapier) + prédiction/réconciliation ; succès, classements, amis, chat, tournois, analytics, localisation.
4. (P3) IA, Égaliseur, Griot, IDC, traduction, assistant de conception.

---

## C. `contracts` : contrats d'API & d'événements

### Responsabilité

Source de vérité des **contrats inter-services** : schémas d'événements du bus et définitions d'API (OpenAPI/types).

### Contenu

- `events/` : types et versions des événements (`GamePublished`, `PaymentSucceeded`, `SessionEnded`, …).
- `openapi/` : spécifications OpenAPI par service (base des APIs publiques `/v1`).
- `types/` : DTO partagés générés.

### Arborescence

```text
contracts/
├── events/{index.ts, versions/}
├── openapi/{catalog.yaml, payment.yaml, ...}
├── types/
├── package.json · README.md
```

### Roadmap

1. Types d'événements v1 (MVP) figés tôt.
2. OpenAPI des services MVP.
3. (P2) OpenAPI des APIs publiques `/v1` + versionnage.
