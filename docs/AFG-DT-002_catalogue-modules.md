# AFG-DT-002 — Catalogue des Modules & Mapping Fonctionnel

**African Games Framework — Plateforme Bilibilia**
**Version :** b1 · 14.07.2026

Ce document fait le pont entre les **couches fonctionnelles du CDCF (AFG-001)** et les **services techniques**. Il donne l'inventaire des modules, le mapping, la matrice de dépendances et les fiches de chaque module (dans `modules/`).

---

## 1. Mapping : couches CDCF → services techniques

| Couche / Chapitre CDCF | Service(s) technique(s) porteur(s) |
|---|---|
| Couche 1 — Marketplace africaine | `catalog-service` (+ `payment`, `publishing`) |
| Couche 2 — Gaming Platform | `game-service` (+ `realtime`) |
| Couche 3 — Infrastructure sociale | `social-service` (+ `realtime`, `identity`) |
| Couche 4 — Culturelle (Mode Griot) | `griot-service` (+ `ai`) |
| Couche 5 — Compétences (Taxonomie, IDC) | `skills-idc-service` |
| Couche 6 — Intelligence artificielle | `ai-service` (transverse) |
| Couche 7 — Égaliseur de niveau | `game-service` (règle métier) + `ai` (P3) |
| Couche 8 — SDK | `bilia-sdk` (package client) + `shared` |
| Couche 9 — Paiements (Wallet, Jetons, abonnements) | `payment-service` |
| Couche 10 — Analytics | `analytics-service` |
| Couche 11 — Notifications | `notification-service` (+ `realtime`) |
| Couche 12 — Sécurité & confiance | `identity` (parental/couvre-feu), `publishing` (validation), `governance`, `ai` (modération) |
| Couche 13 — Accessibilité & inclusion | transverse : `apps/*` + `i18n-service` |
| Ch. 6 — Cycle de vie d'un jeu | `publishing-service` |
| Ch. 7-8 — Parcours joueur, Passeport Ludique | `analytics-service` (+ `identity`, `catalog`) |
| Ch. 9 — Recommandations | `skills-idc-service` (+ `ai`) |
| Ch. 10-13 — Tournois, saisons, événements, collections | `tournament-service` (+ `catalog` pour collections) |
| Ch. 14 — Taxonomie des jeux | `catalog-service` (+ `shared/taxonomies`) |
| Ch. 15-16 — Référentiel compétences, IDC | `skills-idc-service` |
| Ch. 17 — Moteur de recommandation | `skills-idc-service` / `ai-service` |
| Ch. 18 — Moteur de règles métier | `game-service` (module `rules-engine`) |
| Ch. 19-29 — Game Studio (no-code, composants, sandbox…) | `studio-service` |
| Ch. 30-37 — Gouvernance (labels, certif, PI, signalements, réputation) | `governance-service` |
| Ch. 38-40 — APIs, connecteurs, partenaires | `gateway` (APIs publiques) + `i18n` + connecteurs LMS/ERP |

---

## 2. Inventaire des modules

### 2.1 Services backend (bounded contexts)
`gateway`, `identity-service`, `catalog-service`, `publishing-service`, `game-service`, `realtime-service`, `payment-service`, `skills-idc-service`, `analytics-service`, `notification-service`, `social-service`, `griot-service`, `ai-service`, `tournament-service`, `governance-service`, `i18n-service`, `studio-service`.

### 2.2 Packages partagés
- `shared/core` (package **`@shared/core`**) — logger (Winston), middleware (auth), types, erreurs, taxonomies, `THEMES_REGISTRY` (registre + génération de variables CSS), utilitaires (ex. `timeGuard`). Consommé par `services/*`.
- `shared/components` (package **`@shared/ui`**) — bibliothèque de composants React (base shadcn/ui), `globals.css`, hooks partagés. Consommé par `apps/*`. Voir AFG-DT-004 §2 pour la justification du découpage en deux packages.
- `bilia-sdk` — SDK client pour les jeux (comptes, parties, save, paiement, notifications, plus tard IA/Griot/IDC).
- `contracts` — schémas d'API (OpenAPI) et types d'événements partagés.

### 2.3 Applications (clients)
- `apps/bilia-landing-page` — site vitrine.
- `apps/pwa-child` (Bilia-Child) — PWA joueur, offline-first.
- `apps/dashboard-parent` (Bilia-Parent) — contrôle parental, famille, suivi.
- `apps/dashboard-creator` — tableau de bord créateur/studio (P2).
- `apps/admin-console` — administration, modération, validation (P2).

---

## 3. Matrice de dépendances (appelant → appelé)

`E` = événement (asynchrone), `S` = appel synchrone.

| ↓ appelle → | ident | catal | publ | game | rt | pay | skill | ana | notif | soc | griot | ai | tourn | gov | i18n | studio |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **gateway** | S | S | S | S | S | S | S | S | S | S | S | S | S | S | S | S |
| **catalog** | S | — | E | — | — | S | S | E | E | — | E | S | E | S | S | — |
| **publishing** | S | E | — | — | — | — | E | — | E | — | — | S | — | S | — | — |
| **game** | S | S | — | — | S | S | E | E | E | — | S | S | E | — | — | — |
| **realtime** | S | — | — | S | — | — | — | E | S | S | S | — | — | — | — | — |
| **payment** | S | S | — | — | — | — | — | E | E | — | — | — | — | S | — | — |
| **skills-idc** | — | S | E | — | — | — | — | E | — | — | — | S | — | — | — | — |
| **analytics** | S | S | — | S | E | S | S | — | — | S | — | S | S | — | — | — |
| **social** | S | — | — | — | S | — | — | E | S | — | — | S | — | S | — | — |
| **griot** | — | S | — | — | — | — | — | — | — | — | — | S | — | S | S | — |
| **ai** | S | S | S | S | — | — | S | S | — | S | S | — | — | S | S | S |
| **tournament** | S | S | — | S | S | S | S | E | E | S | — | — | — | — | — | — |
| **governance** | S | S | S | — | — | S | S | — | E | S | S | S | — | — | — | S |
| **studio** | S | E | S | — | — | — | S | — | — | — | — | S | — | S | — | — |

> Lecture : `game` **appelle** `payment` en synchrone (achat in-game) et émet vers `analytics`/`skills-idc` en asynchrone (fin de partie). L'`ai-service` est le plus transverse (assistance partout, garde-fous humains conservés). `publishing` appelle `governance` en synchrone pour la décision de validation (pas `tournament`, qui n'a pas de dépendance directe vers `publishing`).

---

## 4. Découpage par phase

**MVP (Phase 1)** — 10 services : `gateway`, `identity`, `catalog`, `publishing`, `game`, `realtime`, `payment`, `skills-idc`, `analytics`, `notification` + `shared` + `bilia-sdk` (base) + apps `landing`/`pwa-child`/`dashboard-parent`.

**Phase 2 — Croissance** : `social`, `griot`, `ai`, `tournament`, `governance`, `i18n` + apps `dashboard-creator`/`admin-console` + SDK avancé.

**Phase 3 — Plateforme complète** : `studio` (no-code/low-code), IA de création, Griot IA dynamique, égaliseur piloté IA, cloud gaming (selon faisabilité), écosystème partenaires complet.

---

## 5. Fiches de modules

Chaque module dispose d'une fiche dédiée dans `modules/` : **responsabilité, périmètre fonctionnel par phase, entités/modèles, API & événements, dépendances, arborescence, roadmap de conception.**

- `modules/gateway.md`
- `modules/identity-service.md`
- `modules/catalog-service.md`
- `modules/publishing-service.md`
- `modules/game-service.md`
- `modules/realtime-service.md`
- `modules/payment-service.md`
- `modules/skills-idc-service.md`
- `modules/analytics-service.md`
- `modules/notification-service.md`
- `modules/social-service.md`
- `modules/griot-service.md`
- `modules/ai-service.md`
- `modules/tournament-service.md`
- `modules/governance-service.md`
- `modules/i18n-service.md`
- `modules/studio-service.md`
- `modules/shared-and-sdk.md`

Le gabarit commun est dans `modules/_TEMPLATE.md`.
