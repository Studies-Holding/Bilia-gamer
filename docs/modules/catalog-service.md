# Module : `catalog-service`

**Phase :** MVP · **Port :** 5002 · **Base :** MongoDB `catalog` (+ index recherche)

## 1. Responsabilité

Porter la **Marketplace** : fiches de jeux publiées, catégories, **taxonomie des jeux**, recherche multicritère, collections, mise en avant (nouveautés, populaires, recommandés), droits d'accès aux jeux.

## 2. Périmètre fonctionnel par phase

- **MVP :** catalogue, recherche multicritère (âge, nombre de joueurs, durée, langue, culture, compétences via IDC, prix), catégories, collections, listings (nouveautés/populaires/recommandés simples), attribution du droit d'accès après achat.
- **Phase 2 :** packs de jeux, offrir un jeu, précommandes, wishlist, codes/cartes cadeaux, vitrines thématiques, place de marché des assets.
- **Phase 3 :** vitrines générées par IA, recommandations intelligentes, place de marché B2B, marketplace de composants/narrations.

## 3. Entités / modèles principaux

- `Game` (vue catalogue) : titre, description, médias, âge, joueurs, durée, langues, modes, modèle éco, `creatorId`, `versionId`, `taxonomy`, `idcRef`, labels.
- `Category` / `SubCategory`, `Collection` (thématiques, culturelles).
- `GameListing` : nouveautés, populaires, recommandés, vitrines.
- `AccessGrant` : droit d'accès d'un profil à un jeu (source : achat/abonnement/pass).
- `SearchIndex` (projection recherche).

## 4. API principales

- `GET /games`, `GET /games/:id`, `GET /search?…` (multicritère)
- `GET /categories`, `GET /collections/:id`
- `GET /listings/{new|popular|recommended}`
- `GET /access/:profileId/:gameId` (droit d'accès)
- (interne) `POST /catalog/index` (indexation sur `GamePublished`)

## 5. Événements

- **Produits :** `GameIndexed`, `AccessGranted`, `AccessRevoked`.
- **Consommés :** `GamePublished`/`GameUpdated` (publishing), `PaymentSucceeded`/`SubscriptionChanged` (payment → droit d'accès), `IDCUpdated` (skills-idc → tri/reco).

## 6. Dépendances

- **S :** `payment` (statut d'achat), `skills-idc` (IDC pour tri/recherche par compétences), `identity` (contexte profil), `governance` (badges labels/certification sur fiche), `i18n` (contenu de fiche localisé), `ai` (reco P3).
- Externes : moteur de recherche (Atlas Search/OpenSearch), object storage (médias via CDN).

## 7. Arborescence

```text
services/catalog-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{game,search,category,collection,listing,access}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── catalog.service.ts
│   │   ├── search.service.ts        # requêtes multicritères
│   │   ├── listing.service.ts       # nouveautés/populaires/recommandés
│   │   └── access.service.ts        # droits d'accès
│   ├── models/{game,category,collection,accessGrant}.model.ts
│   ├── search/                      # mapping index, analyzers
│   ├── events/{consumers,producers}.ts
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module

1. Modèle `Game` (projection) + `Category`/`Collection`.
2. Consumer `GamePublished` → indexation + listings de base.
3. Recherche multicritère (dont filtre par compétences via IDC).
4. `AccessGrant` + consumer `PaymentSucceeded`/`Subscription`.
5. Listings dynamiques (populaires = signaux analytics).
6. (P2) Packs, cadeaux, wishlist, précommandes, marketplace assets.
7. (P3) Vitrines IA, B2B, marketplace composants/narrations.
