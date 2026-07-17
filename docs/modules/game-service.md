# Module — `game-service`

**Phase :** MVP · **Port :** 5004 · **Base :** MongoDB `game`
*(Nom hérité du service `game` de BiLiA-V4 ; implémentation reconstruite from scratch, cf. AFG-DT-004 §1.)*

## 1. Responsabilité
Cœur de l'expérience de jeu (Gaming Platform) : **parties, salles, sauvegardes**, **moteur de règles métier**, **égaliseur de niveau**, succès, classements, historique. C'est la vérité métier d'une session ; le temps réel est relayé par `realtime-service`.

> **Deux familles de jeux (AFG-DT-005).** La majorité des jeux du CDCF (quiz, calcul mental, cartes, awalé, plateau) sont **tour-par-tour** : ils passent par le **moteur de règles** (`rules-engine`), sans physique ni tick continu. Les jeux **d'action/3D** (football, boxe…) nécessitent un **game server stateful** avec **boucle de tick** + **Babylon `NullEngine` headless** + **physique Havok** (ou Rapier déterministe), autorité serveur (anti-triche par construction), snapshots diffusés via geckos.io. Les deux cohabitent selon le jeu publié.

## 2. Périmètre fonctionnel par phase
- **MVP :** créer/rejoindre/quitter/reprendre une partie, salles privées (code), sauvegardes, **moteur de règles v0** (tours, chronomètre, score, manches, équipes, conditions de victoire), **égaliseur de niveau** (attribution d'un niveau par profil), succès et classements de base.
- **Phase 2 :** tournois (délégué à `tournament`), classements avancés, défis, égaliseur dynamique, règles étendues (éliminations, quêtes, saisons, campagnes, arbitrages auto).
- **Phase 3 :** cross-plateforme, synchronisation multi-écrans avancée, égaliseur piloté par IA (apprentissage du niveau réel), cloud gaming (faisabilité).

## 3. Entités / modèles principaux
- `GameSession` : état d'une partie, joueurs, tour courant, statut.
- `Room` : salle (privée/publique), code, participants, réglages.
- `Save` : sauvegarde d'état (par jeu/profil), reprise multi-appareil.
- `RuleSet` : configuration des règles activées (moteur de règles).
- `LevelAssignment` : niveau attribué par profil (égaliseur).
- `Achievement`, `Leaderboard`, `MatchHistory`.

## 4. API principales
- `POST /sessions`, `POST /sessions/:id/join`, `POST /sessions/:id/leave`, `POST /sessions/:id/resume`
- `POST /rooms` (code), `GET /rooms/:code`
- `PUT /sessions/:id/save`, `GET /saves/:profileId/:gameId`
- `POST /sessions/:id/action` (appliquée via moteur de règles)
- `GET /leaderboards/:gameId`, `GET /achievements/:profileId`

## 5. Événements
- **Produits :** `SessionStarted`, `SessionEnded` (avec compétences mobilisées), `AchievementUnlocked`, `ScoreRecorded`.
- **Consommés :** `CurfewChanged` (identity → coupure/limitation), `TournamentMatchScheduled` (tournament).

## 6. Dépendances
- **S :** `identity` (profils + couvre-feu), `catalog` (droit d'accès + config jeu), `payment` (achats in-game), `griot` (contexte culturel), `skills-idc` (mapping compétences), `ai` (égaliseur piloté par IA — P3).
- Relayé par `realtime` (sync). Émet vers `analytics`/`skills-idc` (fin de partie).

## 7. Arborescence
```
services/game-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{session,room,save,leaderboard}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── session.service.ts
│   │   ├── room.service.ts
│   │   ├── save.service.ts
│   │   ├── equalizer.service.ts       # égaliseur de niveau
│   │   └── scoring.service.ts
│   ├── rules-engine/                  # MOTEUR DE RÈGLES MÉTIER (tour-par-tour)
│   │   ├── index.ts
│   │   ├── turns.ts · timer.ts · score.ts · rounds.ts
│   │   ├── teams.ts · victory.ts · tiebreak.ts
│   │   └── rules.types.ts
│   ├── game-server/                   # runtime action autoritatif (AFG-DT-005)
│   │   ├── loop.ts                    # boucle de tick (20-30 Hz)
│   │   ├── simulation.ts              # Babylon NullEngine (headless)
│   │   ├── physics.ts                 # Havok (défaut) / Rapier (déterministe)
│   │   └── reconciliation.ts          # anti-triche / réconciliation
│   ├── models/{gameSession,room,save,ruleSet,leaderboard}.model.ts
│   ├── events/
│   └── utils/
├── tests/
│   ├── rules-engine/                  # tests purs des règles
│   └── equalizer.test.ts
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. `GameSession` + `Room` (code) + cycle create/join/leave/resume.
2. `Save` + reprise multi-appareil.
3. **Moteur de règles v0** (modules purs, très testés) : tours, timer, score, manches, victoire.
4. **Égaliseur de niveau** (attribution par profil) + tests.
5. Succès + classements + historique ; `SessionEnded` → compétences.
6. Application du couvre-feu au runtime (consumer `CurfewChanged`).
7. Runtime action v0 : game server stateful + boucle de tick + NullEngine + physique Havok (1re expérience action).
8. (P2) Règles étendues + défis + égaliseur dynamique + hooks tournois ; option Rapier déterministe pour les modes compétitifs.
9. (P3) Cross-plateforme, égaliseur IA, cloud gaming.
