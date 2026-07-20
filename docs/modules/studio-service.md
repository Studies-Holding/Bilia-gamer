# Module : `studio-service` (Game Studio)

**Phase :** P3 · **Port :** 5016 · **Base :** MongoDB `studio` (+ object storage projets/assets)

## 1. Responsabilité

Environnement de **création de jeux intégré** : éditeur visuel, moteurs d'édition (scènes, règles, événements, variables, UI, animations, audio, vidéo), générateurs IA, no-code/low-code, collaboration, versioning, marketplaces de composants créatifs, gouvernance du cycle de vie projet. Concrétise le pilier « Créer » et l'ambition d'AFG-005 : « permettre à chacun de créer un jeu africain grâce à une approche progressive » : de l'enseignant sans compétence technique au studio professionnel. Un jeu créé au Studio est **publié via le même pipeline** que `publishing-service` (validation, IDC, catalogue) ; le Studio prépare la fiche mais ne remplace pas la validation éditoriale/culturelle.

> Reste **P3** (aucune avance de phase) : les fondations MVP (identity, catalog, publishing, game, payment/wallet, skills-idc) doivent être stables avant d'exposer un éditeur public. Cf. AFG-DT-003 Lot 11.
> **Deux clients, une seule API (décision du 20.07.2026, AFG-DT-001 ADR-11) :** ce backend (`studio-service`) sert à la fois le **Studio web** (React, no-code/low-code : créateurs Niveau 1-2) et l'**éditeur natif C++** `apps/studio-editor-native` (GDExtension sur Godot Engine : créateurs Niveau 3-4). Aucune divergence de contrat entre les deux : mêmes entités (§10), mêmes endpoints (§11), mêmes événements (§12). Voir `apps/studio-editor-native/README.md` pour l'architecture du client natif.

## 2. Niveaux de créateurs (AFG-005 ch.1)

Le Studio s'adapte au niveau de l'utilisateur plutôt que d'imposer un seul mode :

- **Niveau 1 : Créateur débutant** : aucune compétence technique, assemble des composants (ex. modèle Quiz + thème + 20 questions).
- **Niveau 2 : Créateur intermédiaire** : personnalise règles, scores, cartes, images, niveaux à partir d'un projet existant.
- **Niveau 3 : Développeur** : utilise SDK, APIs, plugins, scripts (Mode Développeur/Low-Code).
- **Niveau 4 : Studio professionnel** : moteur personnalisé, IA avancée, composants avancés, marketplace : garde la maîtrise de son propre moteur graphique tout en consommant les SDK AFG (Wallet, Matchmaking, Tournois, IDC…).

## 3. Modes de création (AFG-005 ch.2, 31-33)

- **Mode Assistant** : création guidée pas à pas.
- **Mode Template** : à partir d'un modèle (Quiz, mémoire, puzzle, escape game, cartes, football, simulation, serious game, etc. : dizaines de templates, cf. AFG-005 ch.3/34).
- **Mode Visuel / No-Code** : glisser-déposer, aucune ligne de code, connexion native au SDK.
- **Mode Low-Code** : personnalisation des règles/scripts simples/comportements/APIs sans moteur complet.
- **Mode Développeur** : programmation complète, architecture/algorithmes/moteur graphique propres, SDK en enrichissement.
- **Mode IA** : création par prompt (« jeu coopératif pour une famille de quatre personnes sur les capitales africaines ») → l'IA propose règles, structure, niveaux, scoring, illustrations, badges.

## 4. Périmètre fonctionnel par phase

- **Phase 3 (construction initiale du Studio) :** éditeur visuel (espaces de travail : explorateur, scène, bibliothèque de composants/assets, inspecteur, arborescence, console, prévisualisation, assistant IA, marketplace), templates principaux, bibliothèque d'assets, publication, intégration SDK, IA d'assistance simple.
- **Phase 3+ (montée en puissance, toujours hors MVP Bilibilia) :** No-Code complet, Low-Code, marketplace des assets, marketplace des templates, collaboration multi-rôles, versioning, copilote IA de Game Design.
- **Horizon suivant (non planifié) :** marketplace des mécaniques/IA/packs culturels/scénarios/questions, IA générative avancée, génération automatique de jeux complets, co-création homme/IA, publication multi-plateformes en un clic : cible du framework AFG générique (cf. AFG-004 ch.45 Phase 4), à réévaluer selon besoin produit Bilibilia.

## 5. Moteurs de l'éditeur visuel (AFG-005 ch.11-19)

Le cœur du Studio : un éditeur graphique drag & drop où chaque élément du jeu est un composant visuel, organisé autour de six moteurs spécialisés.

- **Moteur de scènes** : un jeu est une suite de scènes (accueil, menu, tutoriel, niveaux, boutique, inventaire, résultats, fin de partie), chacune indépendante.
- **Moteur de règles** : règles métier décrites visuellement (« si 100 points → débloquer niveau suivant », « si tournoi gagné → créditer le Wallet »), sans programmation : se branche sur le rules-engine partagé avec `game-service`.
- **Moteur d'événements** : événements standards du jeu (début de partie, carte retournée, badge obtenu, paiement effectué…) assemblables visuellement : distincts mais alimentés par les événements du SDK (`modules/shared-and-sdk.md` §B) et du bus inter-services.
- **Moteur de variables** : variables prêtes à l'emploi (score, vie, temps, Jetons, inventaire, progression, compétences IDC…), ex. `Wallet Balance` directement branchable en UI.
- **Moteur d'interfaces** : composants d'UI (boutons, menus, listes, Wallet, profils, classements), assemblage responsive automatique.
- **Moteur d'animations / audio / vidéo** : bibliothèque d'animations (déplacement, zoom, transition…), gestion complète des sons (musiques, voix, Mode Griot, ambiances) et intégration de séquences vidéo (cinématiques, tutoriels, séquences historiques).

## 6. Générateurs IA (AFG-005 ch.20-25, 45)

Six générateurs assistent la création sans se substituer au créateur : **générateur de jeux** (prompt → première version jouable), **générateur de niveaux** (progression équilibrée sur N niveaux), **générateur de questions** (quiz/serious games, avec explications et indices), **générateur d'illustrations**, **générateur de personnages**, **générateur de dialogues**. Le **Copilote IA du Game Designer** (ch.45) est distinct : il ne crée pas à la place du créateur mais suggère (mécaniques, équilibrage, ergonomie, adaptations familles/écoles) : analogue à l'IA Créateur du SDK (`modules/shared-and-sdk.md` §B, AI SDK).

## 7. Collaboration & versioning (AFG-005 ch.26-29)

Plusieurs rôles collaborent en temps réel sur un même projet (développeur, graphiste, game designer, scénariste, compositeur, traducteur, expert métier, testeur), avec commentaires contextuels sur un élément du jeu et un mini gestionnaire de tâches (création, assignation, priorités, avancement). Le versioning permet de créer/comparer/restaurer des versions et de créer des branches : essentiel dès qu'un projet dépasse un seul créateur.

## 8. Marketplaces créatives (AFG-005 ch.34-40, recoupe AFG-004 ch.34-38)

Au-delà de la marketplace de jeux (`catalog-service`), le Studio adresse des marketplaces de **briques de création** : templates, assets (personnages, décors, musiques, modèles 3D…), mécaniques de jeu complètes (moteur de football, de quiz, de Monopoly…), IA spécialisées (IA Griot, IA Historien, IA Coach RH…), packs culturels (identité visuelle/sonore par pays/culture, sans changer les règles), scénarios (campagnes, quêtes), et questions (banques pédagogiques). Chaque brique publiée génère des revenus pour son créateur, répartis via `payment-service`/`wallet-service`. Priorité de mise en œuvre : assets et templates avant mécaniques/IA/scénarios (cf. AFG-004 ch.45, phasage cohérent).

## 9. Gouvernance du cycle de vie projet & certification (AFG-005 ch.41-42, 30)

Chaque projet suit un cycle : idée → prototype → développement → tests → validation → certification → publication → maintenance → archivage, visible dans un tableau de bord créateur (téléchargements, ventes, revenus, joueurs actifs, compétences développées). Avant publication, des **tests automatiques** vérifient conformité SDK, sécurité, performances, accessibilité, taxonomie, IDC, traduction et qualité des métadonnées : la publication est bloquée si un critère bloquant manque (ex. compétences IDC non déclarées), avec proposition d'assistance. Ce contrôle recoupe le laboratoire d'intégration du SDK (`modules/shared-and-sdk.md` §B) et les contrôles auto déjà prévus dans `publishing-service` (AFG-DT-002) : le Studio prépare le jeu, `publishing-service` reste responsable de la validation finale et de la certification (badges AFG, cf. `modules/governance-service.md`).

## 10. Entités / modèles principaux

- `Project` : projet de jeu (scènes, logique, assets, niveau créateur associé).
- `Scene`, `Rule`, `EventBinding`, `Variable`, `UIComponent` : briques du moteur d'édition, rattachées à un `Project`.
- `Component` : brique réutilisable (règle, mécanique, UI) publiable en marketplace.
- `Template` : modèle de jeu prêt à personnaliser.
- `AssetRef` : référence à un asset (bibliothèque interne ou marketplace).
- `Sandbox` : instance d'exécution isolée.
- `TestRun` : résultats des tests automatiques (conformité SDK/sécurité/accessibilité/IDC/taxonomie).
- `ProjectVersion`, `Branch`, `Comment`, `Task` : versioning et collaboration.
- `Feedback` : retours communautaires.

## 11. API principales

- `POST /projects`, `PUT /projects/:id`, `POST /projects/:id/build`
- `GET /components`, `GET /templates`, `GET /assets`
- `POST /projects/:id/scenes`, `POST /projects/:id/rules`, `POST /projects/:id/variables`
- `POST /projects/:id/ai/generate-game` · `/ai/generate-level` · `/ai/generate-questions` · `/ai/generate-illustration` · `/ai/generate-character` · `/ai/generate-dialogue` (→ ai-service)
- `POST /projects/:id/sandbox`, `POST /projects/:id/test`
- `POST /projects/:id/versions`, `GET /projects/:id/versions/:v/diff`, `POST /projects/:id/branches`
- `POST /projects/:id/comments`, `POST /projects/:id/tasks`
- `POST /projects/:id/publish` (→ publishing)

## 12. Événements

- **Produits :** `ProjectBuilt`, `ProjectVersioned`, `StudioGameReadyForPublish` (→ publishing), `ComponentPublished` (marketplace création).
- **Consommés :** `ComponentPublished` (autres créateurs), `AIDesignSuggestion` (ai), `GameCertified` (governance, pour affichage badges dans le cockpit créateur).

## 13. Dépendances

- **S :** `publishing` (publication), `catalog` (composants/templates/assets en marketplace), `skills-idc` (compétences/profil IDC suggéré), `ai` (générateurs IA + copilote), `governance` (composants certifiés, badges), `identity` (rôles collaborateurs).
- **E :** `ComponentPublished` vers `catalog` (indexation marketplace création) : la répartition des revenus créateur (`payment`/`wallet`) est déclenchée en aval, côté `catalog`/`payment`, lors de la vente effective, pas par un appel direct depuis `studio`. Cf. AFG-DT-002 §3 (matrice : `studio` n'appelle ni `payment` ni `wallet` en synchrone).
- Externes : sandbox d'exécution (isolation), object storage (assets/projets).

## 14. Arborescence

```text
services/studio-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{project,scene,rule,variable,component,template,asset,sandbox,test,version,collab}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── project.service.ts
│   │   ├── scene.service.ts · rule.service.ts · event.service.ts · variable.service.ts · ui.service.ts
│   │   ├── component.service.ts · template.service.ts · asset.service.ts
│   │   ├── build.service.ts           # no-code/low-code → jeu exécutable
│   │   ├── sandbox.service.ts · test.service.ts
│   │   ├── ai.service.ts              # client vers ai-service (6 générateurs + copilote)
│   │   ├── version.service.ts · collab.service.ts
│   │   └── marketplace.service.ts     # templates/assets/mécaniques/IA/packs/scénarios/questions
│   ├── engine/                        # runtime no-code/low-code
│   │   ├── nocode-compiler.ts
│   │   ├── rules-binding.ts           # lien vers rules-engine partagé (game-service)
│   │   └── event-binding.ts
│   ├── models/{project,scene,rule,variable,component,template,sandbox,testRun,version,comment,task}.model.ts
│   ├── events/
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 15. Roadmap de conception du module

1. `Project` + moteur de scènes/règles/variables (v0) + `Component`/`Template` (catalogue de base).
2. Éditeur visuel no-code (compilateur vers jeu exécutable réutilisant le rules-engine de `game-service`) + bibliothèque d'assets.
3. Sandbox d'exécution isolée + tests automatiques (conformité SDK/sécurité/accessibilité/IDC/taxonomie).
4. Publication via `publishing-service` (pipeline unique) + intégration SDK complète.
5. IA d'assistance simple (1-2 générateurs) puis extension aux 6 générateurs + copilote Game Design.
6. Low-Code + collaboration multi-rôles + versioning/branches + commentaires/tâches.
7. Marketplace des templates puis des assets (revenus créateurs via `payment`/`wallet`).
8. (Après P3) Marketplace des mécaniques/IA/packs culturels/scénarios/questions ; IA générative avancée : réévalué selon adoption.
