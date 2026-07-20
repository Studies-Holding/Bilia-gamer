# Module : `governance-service`

**Phase :** P2 · **Port :** 5014 · **Base :** MongoDB `governance`

## 1. Responsabilité

Garantir **confiance et qualité** : labels, **certification des créateurs**, **protection de la propriété intellectuelle**, gestion des **signalements**, **réputation**, et modération humaine. C'est le point de décision des validations qui engagent la plateforme.

## 2. Périmètre fonctionnel par phase

- **Phase 2 :** labels (qualité, culturel, éducatif…), **programme de certification des jeux (7 badges AFG, cf. §2bis)**, certification créateurs, dépôt/gestion PI, signalements (contenu/jeu/utilisateur), réputation (créateurs/joueurs), file de modération humaine reliée à l'IA.
- **Phase 3 :** gouvernance des partenaires/marketplace de composants, arbitrage PI avancé, scoring de confiance.

## 2bis. Programme de certification des jeux (AFG-004 ch.43)

Sept badges officiels, **cumulables** par jeu, attribués après vérification (technique, SDK, sécurité, accessibilité, taxonomie, IDC, traduction : laboratoire d'intégration du SDK et tests automatiques du Studio, cf. `modules/shared-and-sdk.md` §B et `modules/studio-service.md` §9) :

| Badge | Signifie |
| --- | --- |
| **AFG Compatible** | Le jeu respecte les standards minimum de la plateforme. |
| **AFG Gold** | Le jeu exploite pleinement les fonctionnalités du SDK. |
| **AFG Education** | Le jeu répond aux exigences pédagogiques. |
| **AFG Family** | Le jeu est optimisé pour un usage familial/intergénérationnel. |
| **AFG Heritage** | Le jeu valorise le patrimoine culturel africain. |
| **AFG Inclusive** | Le jeu respecte les standards d'accessibilité. |
| **AFG Enterprise** | Le jeu est adapté à un usage entreprise. |

Exemple (AFG-004) : un jeu de football peut obtenir Compatible + Family + Inclusive ; un serious game sur l'histoire du Mali peut obtenir Heritage + Education + Gold. Ces badges sont un cas particulier de l'entité `Label` (§3) : `Label.type = 'certification-afg'` avec `Label.code` parmi les sept valeurs ci-dessus.

## 2ter. Labels de jeu (AFG-001 ch.31)

Distincts des 7 badges AFG-004 (§2bis, orientés conformité technique/SDK) : les labels CDCF sont orientés **découverte/filtrage** côté joueur/parent : `Label.type = 'label-cdcf'`. Un même jeu peut cumuler les deux ensembles.

| Label | Signifie |
| --- | --- |
| **Éducatif** | Intérêt pédagogique reconnu. |
| **Culturel** | Valorise le patrimoine africain. |
| **Famille** | Compatible plusieurs générations. |
| **Entreprise** | Adapté au développement de compétences professionnelles. |
| **Accessibilité** | Respecte les critères d'accessibilité. |
| **IA Compatible** | Exploite les services IA de la plateforme. |
| **SDK Premium** | Utilise pleinement les services du SDK (recoupe partiellement AFG Gold, §2bis). |
| **Écoresponsable** | Jeu sensibilisant au développement durable. |

Exemple d'usage (AFG-001) : un parent active "Afficher uniquement : Éducatif + Famille + Culturel" → le catalogue est filtré côté `catalog-service` (lecture des `Label` via événement `LabelGranted`).

## 2quater. Certification de confiance des créateurs (AFG-001 ch.32) : distincte des niveaux de compétence AFG-005

**Deux axes de classification des créateurs, à ne pas confondre :**

- **Niveaux de créateur (AFG-005 ch.1, cf. `modules/studio-service.md` §2)** : axe **compétence technique** (Débutant → Intermédiaire → Développeur → Studio professionnel), détermine quels outils/modes de création sont proposés.
- **Certification de confiance (AFG-001 ch.32, ci-dessous)** : axe **réputation/historique**, indépendant du niveau technique : un Studio professionnel débute aussi "non certifié".

| Statut | Obtenu par |
| --- | --- |
| Créateur Débutant | Statut par défaut à la création du compte. |
| Créateur Vérifié | Historique de jeux publiés bien notés (seuils à définir). |
| Studio Certifié | Structure identifiée, volume/qualité de publication. |
| Partenaire Institutionnel | Musée, ministère, collectivité conventionné. |
| Partenaire Éducation | Établissement scolaire/universitaire conventionné. |
| Créateur Premium | Niveau de confiance et d'ancienneté le plus élevé. |

Ce statut alimente `Reputation` (§3) et conditionne l'affichage ("Studio Certifié") ainsi que, potentiellement, des seuils de publication allégés (P3, à trancher produit).

## 3. Entités / modèles principaux

- `Label` : type + critères + attribution. Couvre à la fois les **7 badges de certification AFG-004** (§2bis, `type='certification-afg'`) et les **labels CDCF** (§2ter, `type='label-cdcf'`).
- `Certification` : statut créateur : **niveaux techniques** (AFG-005) *et* **statut de confiance** (§2quater, AFG-001), deux champs distincts sur l'entité.
- `IPClaim` : dépôt horodaté + revendication de propriété intellectuelle (§2quinquies).
- `Report` : signalement (cible, motif, statut).
- `Reputation` : score par acteur (historique, sanctions).
- `ModerationDecision` : verdict humain (avec entrée IA).

## 2quinquies. Protection de la propriété intellectuelle (AFG-001 ch.33)

Trois mécanismes, portés par `governance-service` en coordination avec `publishing-service` :

- **Dépôt horodaté** : chaque publication (`GameVersion`) reçoit un horodatage faisant foi, conservé indéfiniment.
- **Historique des versions** : toutes les évolutions d'un jeu sont conservées (cf. `publishing-service.md`, `GameVersion`).
- **Détection de plagiat par IA** : comparaison automatique des illustrations, textes, règles, musiques et voix entre jeux publiés (déléguée à `ai-service`, cf. `ai-service.md` : pas de modèle de similarité dans `governance-service` lui-même). En cas de forte proximité détectée, le dossier est transmis aux modérateurs via `Report`.

## 4. API principales

- `POST /reports`, `GET /reports?status=`
- `POST /moderation/:reportId/decide`
- `POST /certifications/:creatorId`, `GET /labels/:gameId`
- `POST /badges/:gameId/evaluate` (évalue l'éligibilité aux 7 badges AFG), `GET /badges/:gameId`
- `PUT /certifications/:creatorId/trust-status` (statut de confiance §2quater : Débutant/Vérifié/Studio Certifié/Partenaire.../Premium)
- `POST /ip-claims`, `GET /ip-claims/:gameId` (dépôt horodaté + revendications)
- `POST /ip-claims/:gameId/check-plagiarism` (déclenche la comparaison via `ai-service`)
- `GET /reputation/:actorId`
- `POST /validations/:submissionId/decide` (décision de publication)

## 5. Événements

- **Produits :** `ValidationDecision` (→ publishing), `ModerationDecision`, `LabelGranted`, `GameCertified` (badge AFG attribué → consommé par `studio-service` pour le cockpit créateur), `CertificationGranted`, `TrustStatusChanged`, `PlagiarismSuspected`, `ReputationChanged`.
- **Consommés :** `GameSubmitted`, `AICheckResult`/`ModerationDecision`/`PlagiarismCheckResult` (ai), `ReportCreated`.

## 6. Dépendances

- **S :** `identity` (rôles validateurs/modérateurs), `ai` (pré-analyse de modération **et** détection de plagiat), `publishing` (contexte jeu, historique de versions pour le dépôt horodaté), `payment` (impacts revenus si sanction).
- Émet vers `publishing`, `catalog`, `notification`.

## 7. Arborescence

```text
services/governance-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{report,moderation,label,certification,ip,reputation}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── moderation.service.ts      # file + décisions humaines
│   │   ├── label.service.ts           # badges AFG-004 (§2bis) + labels CDCF (§2ter)
│   │   ├── certification.service.ts   # niveau technique + statut de confiance (§2quater)
│   │   ├── ip.service.ts              # dépôt horodaté, revendications, plagiat (§2quinquies)
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
