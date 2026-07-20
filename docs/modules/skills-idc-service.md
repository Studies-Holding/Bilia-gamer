# Module : `skills-idc-service`

**Phase :** MVP · **Port :** 5007 · **Base :** MongoDB `skills`

## 1. Responsabilité

Porter le **référentiel des compétences**, l'**Indice de Développement des Compétences (IDC)** et le **moteur de recommandation**. C'est le cœur différenciant « compétences » de la plateforme.

## 2. Périmètre fonctionnel par phase

- **MVP :** référentiel des 6 familles de compétences (cognitives, sociales, personnelles, culturelles, physiques, professionnelles), IDC **niveaux 1-2** (déclaration créateur + validation éditoriale), recommandation par critères (âge, temps, joueurs, langue, culture, compétences, IDC, popularité).
- **Phase 2 :** IDC **niveau 3** (validation communautaire) ; recommandation enrichie (historique, préférences, historique familial, saisons/événements).
- **Phase 3 :** IDC **niveaux 4-5** (analyse comportementale IA + amélioration continue), détection automatique de nouvelles compétences mobilisées, reco pilotée IA.

## 3. Entités / modèles principaux

- `SkillTaxonomy` : familles → compétences (référentiel versionné, partagé via `shared/taxonomies`).
- `IDC` : par jeu, scores par compétence + sources/niveau de confiance (créateur/éditorial/communauté/IA), historique.
- `SkillObservation` : signaux de fin de partie (compétences mobilisées) alimentant l'IDC.
- `Recommendation` : résultats de reco par profil/contexte.

## 4. API principales

- `GET /taxonomy` (référentiel)
- `GET /idc/:gameId`, `POST /idc/:gameId/declare` (créateur), `POST /idc/:gameId/validate` (éditorial/communauté)
- `GET /recommendations?profileId=&context=…`
- (interne) `POST /observations` (sur `SessionEnded`)

## 5. Événements

- **Produits :** `IDCInitialized`, `IDCUpdated`.
- **Consommés :** `GamePublished` (init IDC niv.1), `SessionEnded` (observations → affinage), `AISkillAnalysis` (ai : P3).

## 6. Dépendances

- **S :** `catalog` (métadonnées jeux), `ai` (analyse comportementale P3).
- Émet vers `catalog` (tri/reco), `analytics` (Passeport Ludique).

## 7. Arborescence

```text
services/skills-idc-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{taxonomy,idc,recommendation}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── taxonomy.service.ts
│   │   ├── idc.service.ts             # construction multi-sources
│   │   ├── observation.service.ts     # signaux de partie
│   │   └── recommender.service.ts     # moteur de reco (critères)
│   ├── engine/
│   │   ├── idc-aggregation.ts         # pondération des 5 niveaux (pur)
│   │   └── ranking.ts                 # scoring reco (pur)
│   ├── models/{idc,observation,recommendation}.model.ts
│   ├── data/skill-taxonomy.ts         # référentiel (ou depuis shared)
│   ├── events/
│   └── utils/
├── tests/
│   ├── idc-aggregation.test.ts        # tests purs
│   └── ranking.test.ts
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module

1. Référentiel des compétences (6 familles) + endpoint taxonomie.
2. `IDC` + agrégation niveaux 1-2 (déclaration + éditorial), logique pure testée.
3. Consumer `GamePublished` → init IDC.
4. Moteur de recommandation par critères (ranking pur) + endpoint.
5. Consumer `SessionEnded` → observations → affinage IDC.
6. (P2) Validation communautaire (niv.3) + reco enrichie.
7. (P3) Analyse IA (niv.4-5) + détection auto de compétences.
