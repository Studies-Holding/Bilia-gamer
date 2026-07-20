# AFG : Design Technique de la Plateforme Bilibilia

Ensemble de documents de **conception technique** qui cadrent l'implémentation de la plateforme AFG (African Games Framework) à partir de la vision (AFG-000) et du cahier des charges fonctionnel (AFG-001), en s'appuyant sur les conventions techniques éprouvées de **BiLiA-V4** (prototype antérieur, code non conservé en dépôt : cf. AFG-DT-004).

## Comment lire

1. **AFG-DT-000 : Cadrage technique** : de la vision aux contraintes, principes, pile, NFR.
2. **AFG-DT-001 : Architecture globale** : vues système/conteneurs, flux d'événements, données, infra, ADR.
3. **AFG-DT-002 : Catalogue des modules** : mapping couches CDCF → services, matrice de dépendances.
4. **AFG-DT-003 : Roadmap de conception** : lots de construction, jalons, dépendances.
5. **AFG-DT-004 : Décisions ouvertes & journal des arbitrages** : abandon du code BiLiA-V4, corrections de cohérence documentaire, points encore ouverts.
6. **AFG-DT-005 : Moteur & runtime temps réel** : Babylon.js (rendu + NullEngine serveur), physique Havok/Rapier, réseau bi-transport geckos.io/Socket.io pour les jeux d'action.
7. **`modules/`** : une fiche par service (architecture, arborescence, roadmap) + `shared`/`sdk`/`contracts`.

## Périmètre en un coup d'œil

- **18 services** (11 au MVP, dont `wallet-service` extrait de `payment-service` le 17.07.2026), **3 packages partagés**, **6 applications clientes** (dont `studio-editor-native`, éditeur C++ natif du Game Studio, P3). Cible documentée à ~25 services fins (AFG-003), consolidée au MVP : cf. AFG-DT-002 §3bis.
- Pile : TypeScript, Express, Socket.io, MongoDB (1 base/service), Redis, Nginx, Winston, event bus.
- Phasage : **MVP → Croissance (P2) → Plateforme complète (P3)**, aligné sur la roadmap fonctionnelle du CDCF §13.

## Arborescence cible du monorepo

```text
bilia-gamer/
├── package.json                      # workspaces + scripts install-all / build-all
├── tsconfig.base.json
├── docker-compose.yml                # dev
├── nginx/                            # config gateway edge
├── README.md · ROADMAP.md
│
├── shared/                           # logger, middleware, types, taxonomies, THEMES_REGISTRY
├── contracts/                        # événements + OpenAPI (source de vérité)
├── sdk/
│   └── bilia-sdk/                    # SDK client des jeux
│
├── services/
│   ├── gateway/                      # 5000  (MVP)
│   ├── identity-service/             # 5001  (MVP)
│   ├── catalog-service/              # 5002  (MVP)
│   ├── publishing-service/           # 5003  (MVP)
│   ├── game-service/                 # 5004  (MVP)
│   ├── realtime-service/             # 5005  (MVP)
│   ├── payment-service/              # 5006  (MVP)
│   ├── skills-idc-service/           # 5007  (MVP)
│   ├── analytics-service/            # 5008  (MVP)
│   ├── notification-service/         # 5009  (MVP)
│   ├── social-service/               # 5010  (P2)
│   ├── griot-service/                # 5011  (P2)
│   ├── ai-service/                   # 5012  (P2)
│   ├── tournament-service/           # 5013  (P2)
│   ├── governance-service/           # 5014  (P2)
│   ├── i18n-service/                 # 5015  (P2)
│   ├── studio-service/               # 5016  (P3)
│   └── wallet-service/               # 5017  (MVP, extrait de payment-service le 17.07.2026)
│
├── apps/
│   ├── bilia-landing-page/                      # site vitrine (MVP)
│   ├── pwa-child/                    # PWA joueur Bilia-Child, offline-first (MVP)
│   ├── dashboard-parent/             # contrôle parental / famille Bilia-Parent (MVP)
│   ├── dashboard-creator/            # tableau de bord créateur/studio (P2)
│   ├── admin-console/                # admin / modération / validation (P2)
│   └── studio-editor-native/         # éditeur Game Studio natif C++ (GDExtension/Godot), P3
│
├── docs/                             # ces documents de design (AFG-DT-*)
└── infra/                            # IaC, CI/CD, k8s (P2+)
```

Chaque `services/*` suit le même gabarit interne :

```text
<service>/
├── src/{app.ts, index.ts, logger.ts, config/, routes/, controllers/, services/, models/, events/, middleware/, utils/}
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

(`app.ts` = Express pur testable via supertest ; `index.ts` = bootstrap.)

## Documents sources

- **AFG-000** : Vision stratégique de l'écosystème africain du jeu (non fourni à ce jour).
- **AFG-001** : Cahier des charges fonctionnel, CDCF (non fourni à ce jour).
- **AFG-002** : Architecture Fonctionnelle (reçu 17.07.2026).
- **AFG-003** : Architecture Technique (reçu 17.07.2026).
- **AFG-004** : AFG Game SDK Specification (reçu 17.07.2026).
- **AFG-005** : AFG Game Studio (reçu 17.07.2026).
- **AFG-006 à AFG-010** : statut inconnu ; AFG-007/008/010 annoncés comme à venir, AFG-006/009 non référencés à ce jour (cf. AFG-DT-004 §5).
