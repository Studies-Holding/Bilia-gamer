# AFG-DT-004 : Décisions Ouvertes & Journal des Arbitrages Techniques

**African Games Framework : Plateforme Bilibilia**
**Version :** b4 · 20.07.2026 · **Statut :** Journal vivant, mis à jour à chaque revue de design

Ce document trace les arbitrages tranchés en dehors du flux normal AFG-DT-000 → 003 (revues de cohérence, décisions structurantes prises en cours de route) et les points encore ouverts nécessitant un arbitrage produit/business. Il comble volontairement le trou de numérotation entre AFG-DT-003 et AFG-DT-005 : il n'y a pas eu d'AFG-DT-004 tant qu'il n'y avait pas de décision de ce type à tracer.

---

## 1. Abandon du code BiLiA-V4 (2026-07-17)

**Constat :** au moment de cette revue, le dépôt avait un `git status` non commité supprimant 163 fichiers / ~20 200 lignes de BiLiA-V4 (`services/auth-service`, `core-service`, `game-service`, `socket-service`, `shared/` avec logger/middleware/SDK, `gateway/nginx.conf`, `landing-page/`, `dev-template/`) : le dernier commit (`c894630`) contenait encore ce code. En parallèle, `docs/` (fiches AFG-DT-*) et les scaffolds `apps/bilia-landing-page|dashboard-parent|pwa-child` étaient déjà présents en non-tracké.

**Décision :** suppression confirmée, **on repart de zéro**. BiLiA-V4 n'est plus le socle de code de la plateforme AFG ; il reste une référence de conventions techniques validées (pile, découpage en `auth`/`core`/`game`/`socket`, patterns `app.ts`/`index.ts`, logger Winston partagé).

**Impact documentaire (déjà appliqué dans cette revue) :**

- AFG-DT-000 §1 : reformulé : BiLiA-V4 n'est plus « le point de départ concret », mais une référence de conventions.
- AFG-DT-001 §3 : la note « Alignement BiLiA-V4 » ne parle plus d'extraction mais de filiation de noms ; « extraction progressive » remplacé par « lot par lot ».
- AFG-DT-003 §1 principe 3 et intro : « Extraction progressive depuis BiLiA-V4 » remplacé par « Construction directe vers la cible, lot par lot ».
- `docs/README.md`, `modules/identity-service.md`, `modules/game-service.md`, `modules/realtime-service.md` : mentions « Évolution du service X de BiLiA-V4 » reformulées en « nom hérité, implémentation reconstruite from scratch ».

**Ce que ça change concrètement pour Lot 0 (AFG-DT-003) :** le lot « Fondations » ne consiste plus à extraire `shared`/`gateway` depuis du code existant, mais à les écrire depuis rien. C'est ce que fait le setup d'environnement livré avec cette revue (voir `services/`, `shared/`, `contracts/`, `sdk/` créés ce jour).

**Point ouvert : non tranché ici :** si BiLiA-V4 avait des utilisateurs/données en production, la suppression du code ne supprime pas ces données. Cette revue ne sait pas si c'est le cas. À trancher côté produit avant tout lancement AFG : migration de comptes existants, ou lancement à blanc.

---

## 2. Découpage du package `shared` en `@shared/core` / `@shared/ui` (2026-07-17)

**Constat :** `apps/bilia-landing-page|dashboard-parent|pwa-child` déclarent déjà une dépendance `"@shared/ui": "workspace:*"`, résolue dans `pnpm-lock.yaml` vers `link:../../shared/components`, et importent `@shared/ui/globals.css`. Le dossier `shared/` était vide. La fiche `modules/shared-and-sdk.md` (avant cette revue) documentait `shared/` comme **un seul package** contenant à la fois logger/middleware backend et composants React : alors que le lockfile déjà commité pointait vers un sous-package `shared/components`.

**Décision :** `shared/` reste un dossier conteneur (le glob `shared/**` de `pnpm-workspace.yaml` le permet), avec deux packages :

- `shared/core` → **`@shared/core`** : logger, middleware, types, erreurs, taxonomies, `THEMES_REGISTRY`, utils. Consommé par les services backend.
- `shared/components` → **`@shared/ui`** : composants (shadcn/ui), hooks, `globals.css`. Consommé par les apps frontend.

**Justification :** aucun service Express n'a besoin de React/Tailwind pour son logger ; aucune app Vite n'a besoin de Winston/Express pour un bouton. Le découpage suit une frontière de dépendances réelle, et le nommage `@shared/ui` / `shared/components` était déjà une contrainte de fait (lockfile + imports déjà écrits dans les 3 apps).

**Impact documentaire :** `modules/shared-and-sdk.md` §A réécrite, `AFG-DT-002` §2.2 mis à jour.

**Impact setup :** les deux packages sont créés dans cette session (voir §4 « Setup d'environnement » plus bas dans ce document, et le `git diff` livré).

---

## 3. Corrections de cohérence documentaire (revue du 2026-07-17)

Écarts factuels relevés entre les fiches `modules/*` et les documents de cadrage (AFG-DT-001/002), corrigés dans cette revue :

| # | Écart | Fichier(s) corrigés | Résolution |
| --- | --- | --- | --- |
| 1 | `publishing-service.md` rejetait la dépendance `tournament` (« ? non ») alors que la matrice AFG-DT-002 §3 l'affichait en `S`, et n'affichait *aucune* dépendance vers `governance` alors que la fiche la présente comme centrale. | `AFG-DT-002` (matrice), `modules/publishing-service.md` | Matrice corrigée : `publishing → tournament = :`, `publishing → governance = S`. Fiche nettoyée du « ? non ». |
| 2 | `catalog-service.md` §6 omettait `governance` et `i18n`, présents dans la matrice AFG-DT-002 §3. | `modules/catalog-service.md` | Dépendances ajoutées à la fiche (badges labels/certification, contenu localisé). |
| 3 | `game-service.md` §6 omettait `ai`, présent dans la matrice. | `modules/game-service.md` | Dépendance `ai` ajoutée (égaliseur piloté IA, P3). |
| 4 | Entité `Channel` listée dans le modèle macro AFG-DT-001 §5 pour `notification`, absente de `notification-service.md` §3. | `modules/notification-service.md` | Entité `Channel` ajoutée. |
| 5 | Nommage divergent `GameListing` (AFG-DT-001 §5) vs `Listing` (`catalog-service.md` §3). | `modules/catalog-service.md` | Renommé en `GameListing` partout. |
| 6 | AFG-DT-002 §2.3 nommait l'app `apps/landing` ; le dossier réel est `apps/bilia-landing-page`. | `AFG-DT-002` | Corrigé. |
| 7 | Entités structurantes absentes du tableau macro AFG-DT-001 §5 bien que détaillées dans les fiches : `CurfewPolicy` (identity), `LevelAssignment` (game), `Match`/`Standing` (tournament). | `AFG-DT-001` §5 | Ajoutées aux lignes correspondantes. |
| 8 | `_TEMPLATE.md` prescrivait « Phase d'introduction » et « Port » (singulier strict) ; les 18 fiches réelles utilisent uniformément « Phase » (et `realtime-service.md` utilise légitimement « Ports » au pluriel, multi-port). | `modules/_TEMPLATE.md` | Gabarit aligné sur l'usage réel plutôt que l'inverse (moins de churn), avec note explicite sur le pluriel. |

**Non corrigé, assumé comme écart mineur :** les sections « 6. Dépendances » de `ai-service.md`, `governance-service.md`, `analytics-service.md` restent rédigées de façon abrégée (« quasiment tous », « notamment ») plutôt que de reproduire exhaustivement chaque cellule de la matrice AFG-DT-002 §3. Pas de contradiction franche détectée sur ces fiches, juste un niveau de détail inférieur : à corriger si un désaccord concret apparaît en implémentation.

---

## 4. Lacune identifiée : PWA offline-first non amorcée

**Constat :** AFG-DT-000 §3 (principe 10) et §4.2 exigent une PWA offline-first pour `apps/pwa-child`. Au moment de cette revue, `apps/pwa-child` était un scaffold Vite strictement identique aux deux autres apps (landing, dashboard-parent) : aucune dépendance PWA (`vite-plugin-pwa`, `workbox-*`), pas de manifest, pas de service worker.

**Décision :** traité comme partie du setup d'environnement de cette session plutôt que reporté au Lot 6 (AFG-DT-003) : coût faible, évite d'ajouter la dépendance PWA après coup sur une app qui aurait déjà grossi. Voir le scaffolding livré pour `apps/pwa-child`.

---

## 5. Points ouverts (arbitrage produit/business requis, non tranchés dans cette revue)

- **Sort des utilisateurs/données BiLiA-V4** existants en production, s'il y en a (cf. §1).
- **PSP Mobile Money exact** (AFG-DT-000 §7) : dépend des pays de lancement.
- **Fournisseur(s) LLM/IA** (AFG-DT-000 §7) : abstraction prévue, choix différé.
- **Bascule Kubernetes/Kafka** : déclenchée par la volumétrie réelle, pas par anticipation.
- **Wrappers mobiles natifs** : PWA jugée suffisante au MVP, à revisiter selon adoption.
- **Durées du Gantt AFG-DT-003 §2** : indicatives, à recaler une fois l'équipe et sa vélocité connues.
- **AFG-006, AFG-009** : numérotation non référencée par les documents reçus : réservée ou inexistante, à confirmer. **AFG-007, AFG-008, AFG-010** annoncés comme à venir, contenu inconnu. La série va jusqu'à AFG-024 (cf. §8) : 19 documents restent non reçus.
- **Seuils de la certification de confiance des créateurs** (§8, AFG-001 ch.32 : Débutant → Vérifié → Studio Certifié → Partenaire → Premium) non chiffrés dans la source : critères quantitatifs à définir côté produit avant implémentation de `certification.service.ts` (governance-service).

---

## 6. Intégration AFG-002 / AFG-003 / AFG-004 / AFG-005 (2026-07-17)

**Constat :** réception de quatre nouvelles sources le 17.07.2026 : **AFG-002** (Architecture Fonctionnelle), **AFG-003** (Architecture Technique), **AFG-004** (AFG Game SDK Specification), **AFG-005** (AFG Game Studio). Elles précisent et étendent ce qui n'était jusque-là qu'implicite dans AFG-DT-000/001/002 : règle stricte de séparation Wallet/Payment (AFG-002 ch.22/32/33), cible de décomposition fine à ~25 services avec Data Hub/Data Lake (AFG-003 ch.29-32), spécification complète du SDK (~30 modules cible, dont Matchmaking, Adaptive Gameplay, Monetization, système de plugins, programme de certification : AFG-004), et spécification détaillée du Game Studio (4 niveaux de créateurs, 5 modes de création, moteurs d'édition, générateurs IA, marketplaces : AFG-005).

**Décisions tranchées (arbitrage utilisateur, options recommandées retenues) :**

1. **Séparer `wallet-service` de `payment-service` dès maintenant**, plutôt que différer l'extraction. Justification : AFG-002 pose la séparation comme une règle stricte (le paiement ne doit jamais manipuler un solde directement), pas comme une commodité d'organisation différable : la conserver fusionnée aurait produit une dette architecturale connue dès le départ. Cf. AFG-DT-001 ADR-09, AFG-DT-001 §3/§4.3/§5, AFG-DT-002 §1/§2.1, AFG-DT-003 Lot 4.
2. **Adopter la cible de décomposition fine d'AFG-003 (~25 services) comme cible documentée à long terme**, avec une **stratégie de consolidation MVP explicite** : les ~11 services MVP actuels restent consolidés, mais chaque service cible fin a une ligne documentée indiquant où il vit aujourd'hui et quel signal déclencherait son extraction. Justification : documenter la cible évite le sur-découpage prématuré tout en gardant une trajectoire lisible pour l'équipe. Cf. AFG-DT-002 §3bis (nouvelle section), AFG-DT-001 ADR-10.
3. **Repasse documentaire complète maintenant** plutôt que de laisser le brainstorm sans suite : AFG-DT-000/001/002/003/004 et les fiches `modules/payment-service.md`, `modules/wallet-service.md` (nouvelle), `modules/shared-and-sdk.md` §B, `modules/studio-service.md`, `modules/governance-service.md`, `modules/game-service.md` sont mis à jour dans cette même revue.

**Impact documentaire (cette revue) :**

- `AFG-DT-000` : références aux 4 nouvelles sources ajoutées, distinction AFG (framework générique) / Bilibilia (produit) explicitée, §7 mis à jour (AFG-000/001 toujours absents, AFG-006/007/008/009/010 status noté).
- `AFG-DT-001` : ligne `wallet-service` (port 5017) ajoutée au §3, agrégats `Wallet`/`TokenLedger` déplacés vers `wallet` au §5, séquence §4.3 corrigée (appel synchrone `payment → wallet`), Data Hub/Data Lake ajoutés au §7, ADR-09/ADR-10 ajoutés au §8.
- `AFG-DT-002` : réécriture complète : `wallet-service` dans le mapping/inventaire/matrice, nouvelle §3bis (cible fine + consolidation MVP), phases mises à jour.
- `AFG-DT-003` : Lot 4 scindé en `wallet-service` + `payment-service`, matchmaking v0 ajouté au Lot 3.
- `modules/payment-service.md`, `modules/wallet-service.md`, `modules/shared-and-sdk.md` §B, `modules/studio-service.md`, `modules/governance-service.md`, `modules/game-service.md` : en cours dans cette même revue (voir tâches suivantes).

**Ce qui reste hors périmètre de cette revue :** le contenu détaillé d'AFG-002/003/004/005 (marketplaces, moteurs d'édition, générateurs IA, badges de certification, modules SDK complets) n'est pas dupliqué intégralement dans les `AFG-DT-*` : ces derniers restent des documents de synthèse technique qui référencent les sources plutôt que de les recopier. Se reporter aux documents sources pour le détail exhaustif.

---

## 7. Éditeur Game Studio natif en C++ (2026-07-20)

**Demande :** l'utilisateur souhaite utiliser le C++ pour concevoir l'outil de création de jeu (Game Studio), en complément de l'architecture documentaire déjà posée pour `studio-service`/AFG-005.

**Options évaluées (question posée à l'utilisateur) :**

1. Éditeur natif C++ séparé du Studio web (nouvelle appli desktop), backend `studio-service` partagé.
2. Moteur C++ compilé en WebAssembly, intégré au Studio web existant.
3. Remplacement complet du Studio web par du C++ natif (perte de la version navigateur).
4. Autre / à préciser.

**Décision (choix utilisateur) :** option 1 : **éditeur natif C++ séparé**, `apps/studio-editor-native`. Le Studio web (React, no-code/low-code) reste la porte d'entrée pour les créateurs Niveau 1-2 (accessibilité, pas d'installation, cohérent avec le principe offline-first d'AFG-DT-000 §3). Le C++ vise les créateurs Niveau 3-4 (développeurs, studios professionnels, AFG-005 ch.1), qui bénéficient d'un outil natif performant. Les deux clients consomment la **même API** `studio-service`/`contracts` : aucune divergence de données ni de pipeline de publication.

**Choix technique : GDExtension sur Godot Engine (MIT), pas de moteur from scratch.** Construire les six moteurs d'AFG-005 (scènes, règles, événements, variables, UI, animation/audio/vidéo) en C++ pur aurait représenté un effort disproportionné. Godot fournit déjà des équivalents directs de chacun ; GDExtension (Godot 4.1+) permet de charger du C++ AFG comme plugin dans l'éditeur Godot **officiel non forké** : pas de maintenance de fork, mises à jour moteur gratuites. Détail dans `apps/studio-editor-native/README.md`.

**Impact documentaire :** `AFG-DT-001` ADR-11 (nouvelle), `AFG-DT-000` §4.2 (pile frontend), `AFG-DT-002` §2.3 (apps clientes), `docs/modules/studio-service.md` (note "deux clients, une seule API"), `docs/README.md` (arborescence, compteur d'apps).

**Impact setup (même revue) :** scaffold complet de `apps/studio-editor-native` (CMake, GDExtension, ressources `AfgProject/Scene/Rule/Variable`, panneaux dock stub, tests Catch2) : voir le `git diff` livré. Le build réel nécessite de récupérer `third_party/godot-cpp` (submodule git) et les dépendances vcpkg (`cpp-httplib`, `nlohmann-json`, `Catch2`) ; non exécutable dans l'environnement sandbox de cette session (pas d'accès aux dépôts externes pour les submodules) : à valider en local/CI dès le Lot Studio natif #1.

**Point ouvert :** l'articulation exacte entre `AfgRuleResource::to_rules_engine_json()` (côté éditeur natif) et le schéma réel de `game-service/rules-engine` (côté serveur) n'est pas encore figée dans `contracts/` : à faire au Lot Studio natif #2 (cf. `apps/studio-editor-native/ROADMAP.md`), avant que l'éditeur natif ne produise des règles qui divergeraient du web.

**Confirmation a posteriori (2026-07-20, réception AFG-000/AFG-001) :** AFG-001 ch.19 ("Le Game Studio", Phase 1) cite explicitement Godot comme l'un des moteurs externes acceptés pour la publication de jeux : **à égalité avec Unity, Unreal Engine, Construct, HTML5, Flutter**. Le CDCF traite donc Godot comme un outil tiers que les créateurs utilisent tel quel, pas comme un produit qu'AFG posséderait ou modifierait. Ce texte, non disponible au moment de l'ADR-11, en renforce la justification : forker Godot casserait la logique "plusieurs moteurs externes acceptés à égalité" (pourquoi forker Godot et pas Unreal/Construct ?) et n'a pas de contrepartie stratégique identifiée à ce stade. Rediscuté et **reconfirmé** avec l'utilisateur le 2026-07-20 : on reste sur GDExtension sans fork. Option intermédiaire notée pour plus tard si le besoin de branding se fait sentir : une distribution custom (installeur embarquant le binaire Godot officiel + l'addon AFG préinstallé), sans toucher au code source du moteur.

---

## 8. Réception d'AFG-000 (Vision) et AFG-001 (CDCF) (2026-07-20)

**Constat :** les deux documents fondateurs manquants depuis le début de cette revue (signalés en point ouvert dans AFG-DT-000 §7 et ce document §5 depuis le 17.07.2026) ont été fournis. Lecture complète effectuée.

**Résultat du rapprochement : cohérence globale confirmée**, aucune contradiction avec AFG-002/003/004/005 ni avec les `AFG-DT-*` déjà écrits. Éléments réellement nouveaux, intégrés dans cette même revue :

- **Certification de confiance des créateurs** (AFG-001 ch.32 : Débutant → Vérifié → Studio Certifié → Partenaire Institutionnel/Éducation → Premium), axe **distinct** des niveaux de compétence technique d'AFG-005 ch.1 → `docs/modules/governance-service.md` §2quater.
- **Protection de la propriété intellectuelle** (AFG-001 ch.33 : dépôt horodaté, historique de versions, détection de plagiat par IA) → `governance-service.md` §2quinquies, dépendance ajoutée vers `ai-service`.
- **Labels CDCF** (AFG-001 ch.31 : Éducatif, Culturel, Famille, Entreprise, Accessibilité, IA Compatible, SDK Premium, Écoresponsable), distincts des 7 badges AFG-004 → `governance-service.md` §2ter.
- **IA Business et IA Découverte Culturelle** (AFG-001 ch.14, IA14/IA15) → `docs/modules/ai-service.md`.
- **APIs publiques nommées** (AFG-001 ch.38) et confirmation des connecteurs LMS/ERP/SIRH (ch.39) → `AFG-DT-002` §1.
- **Série documentaire** : AFG-001 (conclusion) confirme une série jusqu'à AFG-024 : 6 documents reçus sur ~25 à ce jour.

**Rediscussion du fork Godot (cf. §7) :** la lecture d'AFG-001 ch.19, qui cite Godot comme un moteur externe parmi six (Unity/Unreal/Construct/HTML5/Flutter), a été utilisée pour rouvrir la question posée par l'utilisateur. **Décision reconfirmée** : pas de fork, GDExtension sur Godot officiel. Détail dans la mise à jour du §7 ci-dessus.

**Impact documentaire :** `AFG-DT-000` (rattachement, §7), `AFG-DT-002` (§1), `docs/modules/governance-service.md`, `docs/modules/ai-service.md`.

---

*Ce document est mis à jour à chaque revue de cohérence documentaire ou décision structurante prise hors du flux AFG-DT-000 → 003. Référencé par AFG-DT-000, AFG-DT-001, AFG-DT-003 et `modules/shared-and-sdk.md`.*
