# Module — `governance-service`

**Phase :** P2 · **Port :** 5014 · **Base :** MongoDB `governance`

## 1. Responsabilité
Garantir **confiance et qualité** : labels, **certification des créateurs**, **protection de la propriété intellectuelle**, gestion des **signalements**, **réputation**, et modération humaine. C'est le point de décision des validations qui engagent la plateforme.

## 2. Périmètre fonctionnel par phase
- **Phase 2 :** labels (qualité, culturel, éducatif…), certification créateurs, dépôt/gestion PI, signalements (contenu/jeu/utilisateur), réputation (créateurs/joueurs), file de modération humaine reliée à l'IA.
- **Phase 3 :** gouvernance des partenaires/marketplace de composants, arbitrage PI avancé, scoring de confiance.

## 3. Entités / modèles principaux
- `Label` : type + critères + attribution.
- `Certification` : statut créateur (niveaux), preuves.
- `IPClaim` : revendication/protection de propriété intellectuelle.
- `Report` : signalement (cible, motif, statut).
- `Reputation` : score par acteur (historique, sanctions).
- `ModerationDecision` : verdict humain (avec entrée IA).

## 4. API principales
- `POST /reports`, `GET /reports?status=`
- `POST /moderation/:reportId/decide`
- `POST /certifications/:creatorId`, `GET /labels/:gameId`
- `POST /ip-claims`, `GET /reputation/:actorId`
- `POST /validations/:submissionId/decide` (décision de publication)

## 5. Événements
- **Produits :** `ValidationDecision` (→ publishing), `ModerationDecision`, `LabelGranted`, `CertificationGranted`, `ReputationChanged`.
- **Consommés :** `GameSubmitted`, `AICheckResult`/`ModerationDecision` (ai), `ReportCreated`.

## 6. Dépendances
- **S :** `identity` (rôles validateurs/modérateurs), `ai` (pré-analyse), `publishing` (contexte jeu), `payment` (impacts revenus si sanction).
- Émet vers `publishing`, `catalog`, `notification`.

## 7. Arborescence
```
services/governance-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{report,moderation,label,certification,ip,reputation}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── moderation.service.ts      # file + décisions humaines
│   │   ├── label.service.ts
│   │   ├── certification.service.ts
│   │   ├── ip.service.ts
│   │   └── reputation.service.ts
│   ├── models/{label,certification,report,reputation,ipClaim}.model.ts
│   ├── events/
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. Signalements + file de modération humaine (entrée IA).
2. Décision de validation de publication (`ValidationDecision`).
3. Labels + certification créateurs.
4. Réputation (créateurs/joueurs) + sanctions.
5. Protection PI (dépôt/revendications).
6. (P3) Gouvernance partenaires/composants + scoring de confiance.
