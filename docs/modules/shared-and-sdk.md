# Modules transverses : `shared`, `bilia-sdk`, `contracts`

**Phase :** MVP · **Type :** packages (pas de service/port propre)

Ces packages du monorepo factorisent le socle commun et évitent aux services et aux créateurs de redévelopper l'infrastructure.

---

## A. `shared` : socle commun, en deux packages

### Responsabilité

Fournir le socle commun aux services (backend) et aux frontends (UI), **sans coupler les deux mondes** dans un seul package. `shared/` est un dossier conteneur (matché par `pnpm-workspace.yaml: shared/**`) qui héberge deux packages npm distincts :

- **`@shared/core`** (`shared/core/`) : logger, middleware, types, erreurs, taxonomies, thèmes, utilitaires. Consommé uniquement par `services/*` (Node).
- **`@shared/ui`** (`shared/components/`) : bibliothèque de composants React (shadcn/ui) + hooks + `globals.css`. Consommé uniquement par `apps/*` (Vite/React).

> **Pourquoi ce découpage (décidé le 2026-07-17, cf. AFG-DT-004 §2) :** un service Express n'a aucune raison d'installer React/Tailwind pour obtenir son logger, et une app Vite n'a aucune raison d'installer Winston/Express pour obtenir un bouton. Le nom de package `@shared/ui` et le chemin `shared/components` sont déjà ceux utilisés par les trois apps scaffoldées (`apps/*/package.json` → `"@shared/ui": "workspace:*"`, résolu vers `shared/components` dans `pnpm-lock.yaml`) : c'est la contrainte de fait qui a tranché le nommage.

### Contenu : `@shared/core`

- `logger/` : Winston + `httpLogger` (meta service-name, corrélation `requestId`).
- `middleware/` : `auth.ts` (source unique, dédupliquée), erreurs, validation.
- `types/` : types de domaine partagés + DTO.
- `errors/` : hiérarchie d'erreurs normalisée.
- `taxonomies/` : taxonomie des jeux + référentiel des compétences (source de vérité).
- `themes/` : `THEMES_REGISTRY` + génération de variables CSS (consommé côté build par `@shared/ui` pour produire `globals.css`, et côté API par les services qui exposent la config de thème).
- `utils/` : utilitaires purs (ex. `timeGuard` si mutualisé), idempotence, dates.

### Contenu : `@shared/ui`

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

### Responsabilité *

Permettre à un créateur de se concentrer sur la logique de son jeu ; toutes les fonctionnalités communes (compte, partie, sauvegarde, paiement, Wallet, temps réel, IDC, IA, Mode Griot, traduction, statistiques…) sont fournies par la plateforme via le SDK, sous forme de modules **plug & play** et **modulaires** (le créateur n'installe que ce dont il a besoin). Cf. **AFG-004** (AFG Game SDK Specification) pour la spécification complète : `bilia-sdk` en est l'implémentation côté Bilibilia ; le SDK AFG générique vise ~27-30 modules à terme, dont certains resteront hors périmètre Bilibilia tant qu'aucun besoin produit ne les justifie (ex. Museum SDK, Enterprise SDK).

> **AFG vs Bilibilia (cf. AFG-DT-000 §1) :** AFG-004 décrit le SDK du framework générique. `bilia-sdk` en implémente le sous-ensemble utile à Bilibilia, phasé selon la roadmap ci-dessous : elle-même dérivée du phasage propre à AFG-004 ch.45 (Phase 1 à 4), et non recalée sur les seules phases MVP/P2/P3 des `AFG-DT-*`.

### Catalogue des modules cible (AFG-004 ch.3, 27-30 modules)

| Module | Contenu (résumé) | Phase AFG-004 | Correspondance Bilibilia |
| --- | --- | --- | --- |
| Core SDK | init, config, connexion API, sécurité, erreurs, versions | 1 (MVP) | `client.ts` |
| Identity SDK | connexion, session, profils, familles, organisations, permissions | 1 (MVP) | `modules/player.ts` |
| Game Runtime SDK | partie, tours, chronos, scores, classements, sauvegardes | 1 (MVP) | `modules/session.ts`, `save.ts` |
| Multiplayer SDK | salons, invitations, sync, chat, reconnexion, spectateurs | 1 (MVP) | `engine/net/` (socket/geckos) |
| Wallet SDK | jetons, crédits, récompenses, cashback | 1 (MVP) | `modules/wallet.ts` (→ `wallet-service`) |
| Payment SDK | achats, abonnements, microtransactions, Mobile Money, cadeaux, coupons | 1 (MVP) | `modules/payment.ts` (→ `payment-service`) |
| Analytics SDK | temps de jeu, sessions, progression, popularité, IDC | 1 (MVP) | `modules/analytics.ts` |
| Marketplace SDK | achat/vente in-game, catalogue, assets, extensions | 1 (MVP) | `modules/marketplace.ts` |
| Notification SDK | push, SMS, email, alertes, invitations, rappels | 1 (MVP) | `modules/notifications.ts` |
| Cloud Save SDK | sauvegarde, sync, reprise, migration, historique | 1 (MVP) | `modules/save.ts` |
| Catalog SDK | accès catalogue, taxonomie, découverte | 1 (MVP) | `modules/player.ts` (droits d'accès) |
| Achievement SDK | badges, succès, collections, diplômes, trophées | 2 | `modules/achievements.ts` |
| IDC SDK | déclaration compétences/pondérations/niveaux, calcul, sync Passeport | 2 | `modules/idc.ts` |
| Griot SDK | narrations, contes, proverbes, contexte culturel, voix | 2 | `modules/griot.ts` |
| Translation SDK | textes, voix, sous-titres, dialogues | 2 | `modules/i18n.ts` |
| Parental Control SDK | temps de jeu, autorisations, achats, validation parentale | 2 | intégré `identity`/`wallet` clients |
| Tournament SDK | tournois, championnats, ligues, classements, finales | 2 | `modules/tournament.ts` |
| Community SDK | amis, familles, clubs, chat, réactions, invitations | 2 | `modules/community.ts` |
| **Matchmaking SDK (nouveau)** | recherche par âge/niveau/langue/pays/compétences IDC/contexte familial, création auto de salons | 2 | `modules/matchmaking.ts` (→ `game-service`, cf. AFG-DT-003 Lot 3) |
| **Adaptive Gameplay SDK (nouveau)** | adaptation difficulté/questions/temps/indices/scénarios par profil (usage intergénérationnel) | 2 | `engine/loop.ts` (égaliseur, extension du v0 MVP) |
| AI SDK | IA joueur, créateur, traduction, enseignant, RH | 3 | `modules/ai.ts` |
| UI Components SDK | boutons, badges, classements, profils, Wallet, inventaires | 3 | consommé côté apps via `@shared/ui` |
| Accessibility SDK | lecture vocale, sous-titres, contrastes, navigation clavier | 3 | intégré `@shared/ui` + apps |
| **Monetization SDK (nouveau)** | achats intégrés, abonnements, pass saisonniers, essais, pub optionnelle, codes promo, licences Éducation/Entreprise | 3 | `modules/monetization.ts` (→ `payment-service`) |
| Education SDK | classes, séances, parcours, évaluations, rapports pédagogiques | 3 | hors périmètre Bilibilia MVP : cible AFG générique |
| Enterprise SDK | formation, team building, soft skills, rapports RH, certifications | 3 | hors périmètre Bilibilia MVP : cible AFG générique |
| Museum SDK | visites, quiz, escape games, collections, audio guide | 3 | hors périmètre Bilibilia MVP : cible AFG générique |
| : (Système de plugins, ch.33-34) | modules tiers installables, marketplace des plugins | 3 | `engine/plugins/` (chargement dynamique) |
| : (Marketplaces assets/mécaniques/IA/packs culturels, ch.35-38) | composants, moteurs de jeu, IA, packs culturels vendables | 3-4 | `modules/marketplace.ts` (extension) |
| : (Génération de jeux IA, SDK No-Code, XR, Cloud Gaming, ch.45) | horizon long terme du framework AFG | 4 | non planifié pour Bilibilia à ce stade |

### Principes transverses (AFG-004 ch.2, 30-33, 39-42)

- **Plug & play / modulaire :** un créateur n'installe que les modules utilisés (ex. Wallet + Achievement sans charger le reste).
- **API-first :** chaque module dialogue avec les APIs AFG, jamais de logique dupliquée côté jeu.
- **Cycle de vie standard :** init → profil → préférences → droits → session → partie → calcul IDC → sync → sauvegarde → fin (ch.32) : implémenté dans `client.ts`/`loop.ts`, non réécrit par chaque jeu.
- **Système d'événements du SDK (ch.39) :** événements standards (`PlayerConnected`, `GameStarted`, `RoundFinished`, `WalletUpdated`, `BadgeUnlocked`, `PurchaseCompleted`, …) publiés automatiquement, consommables par les plugins : distinct des événements du bus inter-services (`contracts/events`), mais alimenté par eux.
- **Mode hors ligne (ch.40) :** sauvegarde locale, file d'attente d'événements, sync différée, cache intelligent : cohérent avec le principe offline-first de `apps/pwa-child` (AFG-DT-000 §3 principe 10).
- **Mode faible consommation (ch.41) :** assets HD vs optimisés sélectionnés automatiquement selon l'appareil.
- **Laboratoire d'intégration (ch.42) :** vérifications automatiques avant publication (compatibilité SDK, sécurité, perfs, accessibilité, traductions, Wallet, IDC, taxonomie) : recoupe les « contrôles auto » déjà prévus dans `publishing-service` (AFG-DT-002).

### Programme de certification (AFG-004 ch.43)

Sept badges, cumulables par jeu : **AFG Compatible** (standards minimum), **AFG Gold** (usage complet du SDK), **AFG Education** (exigences pédagogiques), **AFG Family** (optimisé familles), **AFG Heritage** (valorisation patrimoine culturel africain), **AFG Inclusive** (accessibilité), **AFG Enterprise** (adapté entreprises). Portés fonctionnellement par `governance-service` (cf. `modules/governance-service.md` §3, taxonomie `Label`), le SDK expose côté créateur les prérequis de chaque badge et l'état de certification du jeu.

### Arborescence *

```text
sdk/bilia-sdk/
├── src/
│   ├── index.ts
│   ├── client.ts                 # config, auth, transport, cycle de vie (init→fin)
│   ├── engine/                   # briques moteur optionnelles (AFG-DT-005)
│   │   ├── render/babylon.ts     # abstraction Babylon.js (jeux 3D)
│   │   ├── physics/              # havok.ts (défaut) · rapier.ts (option) : P2
│   │   ├── net/                  # socket.ts · geckos.ts · snapshot.ts · schema.ts
│   │   ├── loop.ts               # boucle client (prédiction/interp., égaliseur, adaptive gameplay)
│   │   └── plugins/              # chargement dynamique de plugins tiers (P3)
│   ├── modules/                  # modules plateforme (cf. tableau ci-dessus)
│   │   ├── player.ts · session.ts · save.ts
│   │   ├── payment.ts · wallet.ts · notifications.ts
│   │   ├── achievements.ts · community.ts · tournament.ts   # P2
│   │   ├── matchmaking.ts                                    # P2 (nouveau, AFG-004 ch.28)
│   │   ├── griot.ts · idc.ts · i18n.ts                       # P2
│   │   ├── ai.ts · monetization.ts · marketplace.ts          # P3
│   ├── types/
│   └── utils/
├── tests/
├── package.json · README.md · ROADMAP.md
```

### Roadmap *

1. **MVP :** Core (client.ts) + Identity/Catalog/Game Runtime/Multiplayer (player, session, save) + Wallet + Payment + Notification + Cloud Save + Analytics (base) + Marketplace (base) ; abstraction rendu Babylon + réseau (socket + geckos) + snapshot interpolation pour les jeux qui en ont besoin.
2. **P2 :** Achievement, IDC, Griot, Translation, Parental Control, Tournament, Community, **Matchmaking (nouveau)**, **Adaptive Gameplay (nouveau)** ; abstraction physique (Havok/Rapier) + prédiction/réconciliation.
3. **P3 :** AI, UI Components, Accessibility, **Monetization (nouveau)**, système de plugins + marketplace des plugins/assets/mécaniques/IA/packs culturels ; Education/Enterprise/Museum SDK évalués selon opportunité produit (hors Bilibilia MVP par défaut).
4. **Horizon long terme (non planifié) :** génération de jeux assistée par IA, SDK No-Code, XR (AR/VR), Cloud Gaming, agents IA autonomes : cible du framework AFG générique, à réévaluer si Bilibilia ou un autre produit AFG en a besoin.

---

## C. `contracts` : contrats d'API & d'événements

### Responsabilité **

Source de vérité des **contrats inter-services** : schémas d'événements du bus et définitions d'API (OpenAPI/types).

### Contenu

- `events/` : types et versions des événements (`GamePublished`, `PaymentSucceeded`, `SessionEnded`, …).
- `openapi/` : spécifications OpenAPI par service (base des APIs publiques `/v1`).
- `types/` : DTO partagés générés.

### Arborescence **

```text
contracts/
├── events/{index.ts, versions/}
├── openapi/{catalog.yaml, payment.yaml, ...}
├── types/
├── package.json · README.md
```

### Roadmap **

1. Types d'événements v1 (MVP) figés tôt.
2. OpenAPI des services MVP.
3. (P2) OpenAPI des APIs publiques `/v1` + versionnage.
