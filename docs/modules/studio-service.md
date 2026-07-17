# Module — `studio-service` (Game Studio)

**Phase :** P3 · **Port :** 5016 · **Base :** MongoDB `studio` (+ object storage projets)

## 1. Responsabilité
Environnement de **création de jeux intégré** : catalogue de composants, templates, **no-code / low-code**, sandbox, tests automatiques, versioning, feedback communautaire, laboratoire d'innovation. Concrétise le pilier « Créer » et prépare l'industrialisation de la création africaine de jeux.

## 2. Périmètre fonctionnel par phase
- **Phase 3 :** projets de jeu, **catalogue de composants** réutilisables (branché sur le moteur de règles), **templates**, éditeur **no-code** puis **low-code**, sandbox d'exécution, tests automatiques, versioning, feedback communautaire, assistants IA de création, laboratoire d'innovation.
- Un jeu créé au Studio est **publié via le même pipeline** que `publishing-service` (validation, IDC, catalogue).

## 3. Entités / modèles principaux
- `Project` : projet de jeu (scènes, logique, assets).
- `Component` : brique réutilisable (règle, mécanique, UI).
- `Template` : modèle de jeu prêt à personnaliser.
- `Sandbox` : instance d'exécution isolée.
- `TestRun` : résultats des tests automatiques.
- `ProjectVersion`, `Feedback`.

## 4. API principales
- `POST /projects`, `PUT /projects/:id`, `POST /projects/:id/build`
- `GET /components`, `GET /templates`
- `POST /projects/:id/sandbox`, `POST /projects/:id/test`
- `POST /projects/:id/publish` (→ publishing)

## 5. Événements
- **Produits :** `ProjectBuilt`, `StudioGameReadyForPublish` (→ publishing).
- **Consommés :** `ComponentPublished` (marketplace composants), `AIDesignSuggestion` (ai).

## 6. Dépendances
- **S :** `publishing` (publication), `catalog` (composants/templates marketplace), `skills-idc` (compétences), `ai` (assistants de conception), `governance` (composants certifiés).
- Externes : sandbox d'exécution (isolation), object storage.

## 7. Arborescence
```
services/studio-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{project,component,template,sandbox,test}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── project.service.ts
│   │   ├── component.service.ts
│   │   ├── template.service.ts
│   │   ├── build.service.ts           # no-code → jeu exécutable
│   │   ├── sandbox.service.ts
│   │   └── test.service.ts
│   ├── engine/                        # runtime no-code/low-code
│   │   ├── nocode-compiler.ts
│   │   └── rules-binding.ts           # lien vers rules-engine partagé
│   ├── models/{project,component,template,sandbox,testRun}.model.ts
│   ├── events/
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. `Project` + `Component` + `Template` (catalogue).
2. Éditeur no-code (compilateur vers jeu exécutable réutilisant le moteur de règles).
3. Sandbox d'exécution isolée + tests automatiques.
4. Versioning + feedback communautaire.
5. Publication via `publishing-service` (pipeline unique).
6. Assistants IA de création + low-code + laboratoire d'innovation.
