# AFG-DT-002 : Catalogue des Modules & Mapping Fonctionnel

**African Games Framework : Plateforme Bilibilia**
**Version :** b3 · 20.07.2026

Ce document fait le pont entre les **couches fonctionnelles du CDCF (AFG-001)** : et, depuis cette revue, la décomposition de référence **AFG-002 (Architecture Fonctionnelle)** / **AFG-003 (Architecture Technique)** : et les **services techniques** effectivement retenus pour Bilibilia. Il donne l'inventaire des modules, le mapping, la matrice de dépendances, la cible de décomposition fine et les fiches de chaque module (dans `modules/`).

---

## 1. Mapping : couches CDCF → services techniques

| Couche / Chapitre CDCF | Service(s) technique(s) porteur(s) |
| --- | --- |
| Couche 1 : Marketplace africaine | `catalog-service` (+ `payment`, `wallet`, `publishing`) |
| Couche 2 : Gaming Platform | `game-service` (+ `realtime`) |
| Couche 3 : Infrastructure sociale | `social-service` (+ `realtime`, `identity`) |
| Couche 4 : Culturelle (Mode Griot) | `griot-service` (+ `ai`) |
| Couche 5 : Compétences (Taxonomie, IDC) | `skills-idc-service` |
| Couche 6 : Intelligence artificielle | `ai-service` (transverse) |
| Couche 7 : Égaliseur de niveau | `game-service` (règle métier) + `ai` (P3) |
| Couche 8 : SDK | `bilia-sdk` (package client) + `shared` |
| Couche 9 : Paiements (Mobile Money, cartes, abonnements) | `payment-service` (+ `wallet-service` pour le solde/Jetons : cf. §3bis) |
| Couche 10 : Analytics | `analytics-service` |
| Couche 11 : Notifications | `notification-service` (+ `realtime`) |
| Couche 12 : Sécurité & confiance | `identity` (parental/couvre-feu), `publishing` (validation), `governance`, `ai` (modération) |
| Couche 13 : Accessibilité & inclusion | transverse : `apps/*` + `i18n-service` |
| Ch. 6 : Cycle de vie d'un jeu | `publishing-service` |
| Ch. 7-8 : Parcours joueur, Passeport Ludique | `analytics-service` (+ `identity`, `catalog`) |
| Ch. 9 : Recommandations | `skills-idc-service` (+ `ai`) |
| Ch. 10-13 : Tournois, saisons, événements, collections | `tournament-service` (+ `catalog` pour collections) |
| Ch. 14 : Taxonomie des jeux | `catalog-service` (+ `shared/taxonomies`) |
| Ch. 15-16 : Référentiel compétences, IDC | `skills-idc-service` |
| Ch. 17 : Moteur de recommandation | `skills-idc-service` / `ai-service` |
| Ch. 18 : Moteur de règles métier | `game-service` (module `rules-engine`) |
| Ch. 19-29 : Game Studio (no-code, composants, sandbox…) | `studio-service` (cf. AFG-005) |
| Ch. 30-37 : Gouvernance (labels, certif, PI, signalements, réputation) | `governance-service` |
| Ch. 38-40 : APIs, connecteurs, partenaires | `gateway` (APIs publiques) + `i18n` + connecteurs (cf. AFG-003 ch.41) |

> **APIs publiques nommées (AFG-001 ch.38, réception 20.07.2026)** : Catalogue (`catalog`), Comptes (`identity`), Paiement (`payment`/`wallet`), Tournois (`tournament`), IDC (`skills-idc`), Analytics (`analytics`), Griot (`griot`), Traduction (`i18n`), IA (`ai`) : toutes exposées `/v1` via `gateway`, versionnage cf. AFG-DT-000 §3.2. Connecteurs LMS/ERP/SIRH (AFG-001 ch.39) confirment le renvoi déjà fait vers AFG-003 ch.41 : pas de nouveau service dédié, ces intégrations restent portées par `gateway` + APIs publiques.

---

## 2. Inventaire des modules

### 2.1 Services backend (bounded contexts)

`gateway`, `identity-service`, `catalog-service`, `publishing-service`, `game-service`, `realtime-service`, `payment-service`, `wallet-service`, `skills-idc-service`, `analytics-service`, `notification-service`, `social-service`, `griot-service`, `ai-service`, `tournament-service`, `governance-service`, `i18n-service`, `studio-service`.

> `wallet-service` ajouté le 17.07.2026, extrait de `payment-service` : cf. AFG-DT-004 §6 pour la justification (alignement AFG-002 ch.32-33).

### 2.2 Packages partagés

- `shared/core` (package **`@shared/core`**) : logger (Winston), middleware (auth), types, erreurs, taxonomies, `THEMES_REGISTRY` (registre + génération de variables CSS), utilitaires (ex. `timeGuard`). Consommé par `services/*`.
- `shared/components` (package **`@shared/ui`**) : bibliothèque de composants React (base shadcn/ui), `globals.css`, hooks partagés. Consommé par `apps/*`. Voir AFG-DT-004 §2 pour la justification du découpage en deux packages.
- `bilia-sdk` : SDK client pour les jeux (comptes, parties, save, paiement, notifications, plus tard IA/Griot/IDC/matchmaking : cf. AFG-004 pour la cible complète des ~30 modules).
- `contracts` : schémas d'API (OpenAPI) et types d'événements partagés.

### 2.3 Applications (clients)

- `apps/bilia-landing-page` : site vitrine.
- `apps/pwa-child` (Bilia-Child) : PWA joueur, offline-first.
- `apps/dashboard-parent` (Bilia-Parent) : contrôle parental, famille, suivi.
- `apps/dashboard-creator` : tableau de bord créateur/studio (P2).
- `apps/admin-console` : administration, modération, validation (P2).
- `apps/studio-editor-native` : éditeur Game Studio **natif C++** (GDExtension sur Godot Engine), pour les créateurs Niveau 3-4 (P3, cf. AFG-DT-001 ADR-11, `docs/modules/studio-service.md` §1). Consomme la même API `studio-service` que le Studio web ; n'est pas un service backend (pas de port/base MongoDB propre).

---

## 3. Matrice de dépendances (appelant → appelé)

`E` = événement (asynchrone), `S` = appel synchrone.

| ↓ appelle → | ident | catal | publ | game | rt | pay | wallet | skill | ana | notif | soc | griot | ai | tourn | gov | i18n | studio |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **gateway** | S | S | S | S | S | S | S | S | S | S | S | S | S | S | S | S | S |
| **catalog** | S | : | E | : | : | S | : | S | E | E | : | E | S | E | S | S | : |
| **publishing** | S | E | : | : | : | : | : | E | : | E | : | : | S | : | S | : | : |
| **game** | S | S | : | : | S | S | S | E | E | E | : | S | S | E | : | : | : |
| **realtime** | S | : | : | S | : | : | : | : | E | S | S | S | : | : | : | : | : |
| **payment** | S | S | : | : | : | : | S | : | E | E | : | : | : | : | S | : | : |
| **wallet** | S | : | : | : | : | : | : | : | E | E | : | : | : | : | : | : | : |
| **skills-idc** | : | S | E | : | : | : | : | : | E | : | : | : | S | : | : | : | : |
| **analytics** | S | S | : | S | E | S | : | S | : | : | S | : | S | S | : | : | : |
| **social** | S | : | : | : | S | : | : | : | E | S | : | : | S | : | S | : | : |
| **griot** | : | S | : | : | : | : | : | : | : | : | : | : | S | : | S | S | : |
| **ai** | S | S | S | S | : | : | : | S | S | : | S | S | : | : | S | S | S |
| **tournament** | S | S | : | S | S | S | S | S | E | E | S | : | : | : | : | : | : |
| **governance** | S | S | S | : | : | S | : | S | : | E | S | S | S | : | : | : | S |
| **studio** | S | E | S | : | : | : | : | S | : | : | : | : | S | : | S | : | : |

> Lecture : `game` **appelle** `payment` en synchrone (achat in-game) et émet vers `analytics`/`skills-idc` en asynchrone (fin de partie). L'`ai-service` est le plus transverse (assistance partout, garde-fous humains conservés). `publishing` appelle `governance` en synchrone pour la décision de validation (pas `tournament`, qui n'a pas de dépendance directe vers `publishing`).
>
> **Règle Wallet (AFG-002 ch.22, ajoutée le 17.07.2026) :** `payment` ne modifie jamais un solde directement : il **appelle** `wallet` en synchrone pour créditer/débiter après une transaction réussie. `game` et `tournament` appellent aussi `wallet` directement pour les récompenses (jetons de fin de partie, gains de tournoi) sans passer par `payment`, qui reste dédié aux transactions financières externes (Mobile Money, carte). `wallet` lui-même ne dépend que d'`identity` (profil + plafonds parentaux) : il ne connaît ni le catalogue ni les moyens de paiement.

---

## 3bis. Cible de décomposition fine (AFG-003) et stratégie de consolidation MVP

AFG-003 (Architecture Technique) décrit une cible à ~25 microservices, plus fine que les 18 services ci-dessus : `Search`, `Marketplace`, `Subscription`, `Chat`, `User Profile`, `Asset`/`Storage`, `Reporting` et `Administration` y sont des services indépendants, alors que Bilibilia les regroupe aujourd'hui dans des bounded contexts plus larges. Décision actée le 17.07.2026 (cf. AFG-DT-004 §6) : **on documente cette cible fine comme trajectoire à terme, sans la construire tout de suite** : sauf pour `wallet-service`, extrait dès maintenant parce qu'AFG-002 en fait une règle d'architecture stricte (pas une simple commodité d'organisation), cf. note ci-dessus.

| Service cible AFG-003 | Vit aujourd'hui dans | Signal d'extraction |
| --- | --- | --- |
| `search-service` | `catalog-service` (module `search/`) | Le moteur de recherche doit indexer au-delà des jeux (créateurs, assets, tournois, institutions : AFG-003 ch.10) ou la charge de requêtes de recherche sature `catalog`. |
| `marketplace-service` | `catalog-service` (listings, `AccessGrant`) | La Marketplace vend au-delà des jeux (assets, composants, packs culturels, templates : AFG-002 ch.31, AFG-005) : le modèle de données et les flux de paiement deviennent trop riches pour rester un sous-module du catalogue. |
| `subscription-service` | `payment-service` (entité `Subscription`) | Les formules se diversifient (Solo/Famille/Créateur/Entreprise/Institution/Éducation, pass saisonniers : AFG-004 ch.27) au point que le cycle de facturation récurrente mérite son propre modèle et sa propre cadence de release. |
| `chat-service` | `realtime-service` (canal Socket.io) + `social-service` (persistance) | Messagerie vocale, modération de chat en temps réel ou historique de conversation à grande échelle qui dépasse ce que `realtime`/`social` peuvent porter sans se coupler fortement. |
| `user-profile-service` | `identity-service` (entité `Profile`) | Le profil (préférences, Passeport Ludique côté présentation, avatar, accessibilité) grossit au point de vouloir évoluer indépendamment du cycle auth/sécurité d'`identity`. |
| `asset-service` / `storage-service` | Objet storage transverse (pas de service dédié) référencé par `catalog`/`publishing`/`griot`/`studio` | Le volume d'assets (images, sons, vidéos, modèles 3D : AFG-003 ch.16) ou le besoin de traitement (transcodage, résolutions HD/optimisée par appareil : AFG-004 ch.41) justifie un service dédié plutôt que des appels directs à l'object storage depuis chaque service. |
| `reporting-service` | `analytics-service` | Les rapports (créateur, RH, pédagogique : AFG-002 ch.16-17) deviennent assez lourds/spécifiques pour se distinguer du calcul temps réel des statistiques. |
| `administration-service` | `governance-service` + `apps/admin-console` (P2) | Le pilotage global (utilisateurs, catalogue, paiements, abonnements, support, configuration : AFG-002 ch.36) dépasse le périmètre validation/modération/PI de `governance`. |

**Principe retenu :** consolider n'est pas ignorer : chaque service consolidé garde une séparation interne claire (module `search/`, `listing/` dans `catalog`, etc.) pour que l'extraction future soit un découpage de code, pas une réécriture. Voir aussi AFG-DT-000 §3 principe 9 (progressivité, pas de sur-ingénierie).

---

## 4. Découpage par phase

**MVP (Phase 1)** : 11 services : `gateway`, `identity`, `catalog`, `publishing`, `game`, `realtime`, `payment`, `wallet`, `skills-idc`, `analytics`, `notification` + `shared` + `bilia-sdk` (base) + apps `landing`/`pwa-child`/`dashboard-parent`.

**Phase 2 : Croissance** : `social`, `griot`, `ai`, `tournament`, `governance`, `i18n` + apps `dashboard-creator`/`admin-console` + SDK avancé (IDC, Griot, Traduction, Contrôle Parental, Tournois, Communautés, Matchmaking, Adaptive Gameplay : cf. AFG-004 ch.45).

**Phase 3 : Plateforme complète** : `studio` (no-code/low-code, cf. AFG-005), IA de création, Griot IA dynamique, égaliseur piloté IA, marketplaces des Assets/Templates/Mécaniques/IA/Packs culturels/Scénarios/Questions, cloud gaming (selon faisabilité), écosystème partenaires complet.

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
- `modules/wallet-service.md`
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
