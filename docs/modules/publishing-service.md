# Module — `publishing-service`

**Phase :** MVP · **Port :** 5003 · **Base :** MongoDB `publishing` (+ object storage)

## 1. Responsabilité

Orchestrer le **cycle de vie d'un jeu** (AFG-001 ch.6) : espace créateur, création de fiche, déclarations (compétences, culturelle, pédagogique), téléversement, **contrôles automatiques**, **validation** (technique, sécurité, éditoriale, culturelle, compétences), publication, versioning et amélioration continue.

## 2. Périmètre fonctionnel par phase

- **MVP :** compte/espace créateur, dépôt de jeu (fiche + assets), contrôles auto (technique, sécurité/malware, plausibilité des compétences), workflow de validation (v0 avec validateurs humains), publication → `GamePublished`, versioning simple.
- **Phase 2 :** file de validation multi-rôles (éditorial, culturel), demandes de justification, mises à jour/patchs, gestion multi-jeux studios, certification en amont.
- **Phase 3 :** validation assistée par IA, intégration Game Studio (jeux créés no-code passent le même pipeline), tests automatiques sandbox.

## 3. Entités / modèles principaux

- `Submission` : jeu déposé, statut (draft → checks → review → published/rejected).
- `GameDraft` : fiche complète (titre, catégorie, médias, âge, joueurs, durée, langues, modes, modèle éco).
- `SkillDeclaration` : compétences déclarées + niveaux (★).
- `CulturalDeclaration` : pays, cultures, langues, personnages, traditions, patrimoine.
- `PedagogicalDeclaration` : usages (école, entreprise, famille, loisirs).
- `GameVersion` : historique des versions, assets, changelog.
- `ValidationReport` : résultats des vérifications par type.

## 4. API principales

- `POST /submissions`, `PUT /submissions/:id` (fiche + déclarations)
- `POST /submissions/:id/upload` (assets), `POST /submissions/:id/submit`
- `GET /submissions/:id/report`
- `POST /versions/:gameId` (nouvelle version)
- (validateurs) `POST /reviews/:submissionId/{approve|reject|request-changes}`

## 5. Événements

- **Produits :** `GameSubmitted`, `GamePublished`, `GameUpdated`, `GameRejected`.
- **Consommés :** `ValidationDecision` (governance), `IDCInitialized` (skills-idc), `AICheckResult` (ai — P2+).

## 6. Dépendances

- **S :** `identity` (compte créateur/validateur), `governance` (décision de validation), `skills-idc` (init IDC). Pas de dépendance vers `tournament` (aucun couplage fonctionnel direct).
- Émet vers `catalog` (indexation), `analytics` (dashboard créateur), `notification`.
- Externes : object storage, scan malware/antivirus, sandbox de test (P3).

## 7. Arborescence

```text
services/publishing-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{submission,upload,version,review}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── lifecycle.service.ts      # machine à états du jeu
│   │   ├── declaration.service.ts    # compétences/culture/pédago
│   │   ├── checks.service.ts         # contrôles auto (sécurité/technique)
│   │   ├── validation.service.ts     # workflow validation
│   │   └── version.service.ts
│   ├── models/{submission,gameVersion,validationReport}.model.ts
│   ├── state-machine/                # définition des transitions
│   ├── events/
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module

1. Machine à états du cycle de vie (10 étapes) + `Submission`.
2. Fiche + déclarations (compétences/culture/pédago).
3. Téléversement assets + contrôles auto (sécurité/malware/technique).
4. Workflow de validation (v0 humain) + `ValidationReport`.
5. `GamePublished` + versioning.
6. (P2) Multi-rôles de validation, patchs, studios multi-jeux.
7. (P3) Validation assistée IA + intégration Game Studio + sandbox.
