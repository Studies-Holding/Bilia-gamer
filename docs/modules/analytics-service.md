# Module : `analytics-service`

**Phase :** MVP · **Port :** 5008 · **Base :** MongoDB `analytics` (+ store analytique)

## 1. Responsabilité

Collecter, agréger et restituer les statistiques par acteur, et produire le **Passeport Ludique** du joueur. Chaque utilisateur comprend son usage ; chaque créateur, ses performances ; chaque admin pilote l'écosystème.

## 2. Périmètre fonctionnel par phase

- **MVP :** analytics joueur (temps de jeu, favoris, compétences mobilisées, historique), analytics famille, analytics créateur (joueurs, temps moyen, achats, abandons, notes, IDC), **Passeport Ludique**, tableaux de bord.
- **Phase 2 :** analytics école (progression des classes, participation) et entreprise (engagement, compétences), analytics avancés (cohortes, rétention, entonnoirs).
- **Phase 3 :** analytics prédictifs (assistés IA), recommandations d'amélioration créateur, tableaux de bord temps réel.

## 3. Entités / modèles principaux

- `PlaythroughStat` : agrégats par session (durée, complétion, compétences).
- `LudicPassport` : profil de compétences cumulées d'un joueur, trophées, univers explorés.
- `CreatorMetrics` : métriques par jeu (joueurs, abandons par niveau, notes).
- `Dashboard` : projections par rôle (joueur/famille/créateur/école/entreprise/admin).

## 4. API principales

- `GET /analytics/player/:profileId`, `GET /passport/:profileId`
- `GET /analytics/family/:familyId`
- `GET /analytics/creator/:creatorId`, `GET /analytics/game/:gameId`
- `GET /analytics/org/:orgId` (P2)
- (interne) `POST /events/ingest`

## 5. Événements

- **Produits :** `PassportUpdated`, `AbandonSpikeDetected` (signal amélioration créateur).
- **Consommés :** `SessionEnded`, `PaymentSucceeded`, `IDCUpdated`, `PlayerPresenceChanged`, ratings/commentaires.

## 6. Dépendances

- **S :** `identity` (profils/orgs), `catalog`/`skills-idc` (métadonnées).
- Consomme la plupart des événements de l'écosystème (rôle observateur).
- Externes : store analytique (time-series/OLAP) si volumétrie l'exige (P2).

## 7. Arborescence

```text
services/analytics-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{player,family,creator,org,passport}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── ingestion.service.ts
│   │   ├── aggregation.service.ts
│   │   ├── passport.service.ts        # Passeport Ludique
│   │   └── dashboard.service.ts
│   ├── projections/                   # vues par rôle
│   ├── models/{playthroughStat,passport,creatorMetrics}.model.ts
│   ├── events/consumers.ts            # écoute large du bus
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module

1. Ingestion d'événements (`SessionEnded`, etc.) + `PlaythroughStat`.
2. Agrégations joueur/famille + tableaux de bord.
3. **Passeport Ludique** (compétences cumulées + trophées).
4. Analytics créateur (abandons par niveau, notes, IDC).
5. Signaux d'amélioration (`AbandonSpikeDetected`).
6. (P2) Analytics école/entreprise + cohortes/rétention.
7. (P3) Prédictif assisté IA + temps réel.
