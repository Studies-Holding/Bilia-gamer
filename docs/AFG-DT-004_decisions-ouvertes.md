 # AFG-DT-004 — Décisions Ouvertes & Journal des Arbitrages Techniques

**African Games Framework — Plateforme Bilibilia**
**Version :** b1 · 17.07.2026 · **Statut :** Journal vivant, mis à jour à chaque revue de design

Ce document trace les arbitrages tranchés en dehors du flux normal AFG-DT-000 → 003 (revues de cohérence, décisions structurantes prises en cours de route) et les points encore ouverts nécessitant un arbitrage produit/business. Il comble volontairement le trou de numérotation entre AFG-DT-003 et AFG-DT-005 : il n'y a pas eu d'AFG-DT-004 tant qu'il n'y avait pas de décision de ce type à tracer.

---

## 1. Abandon du code BiLiA-V4 (2026-07-17)

**Constat :** au moment de cette revue, le dépôt avait un `git status` non commité supprimant 163 fichiers / ~20 200 lignes de BiLiA-V4 (`services/auth-service`, `core-service`, `game-service`, `socket-service`, `shared/` avec logger/middleware/SDK, `gateway/nginx.conf`, `landing-page/`, `dev-template/`) — le dernier commit (`c894630`) contenait encore ce code. En parallèle, `docs/` (fiches AFG-DT-*) et les scaffolds `apps/bilia-landing-page|dashboard-parent|pwa-child` étaient déjà présents en non-tracké.

**Décision :** suppression confirmée, **on repart de zéro**. BiLiA-V4 n'est plus le socle de code de la plateforme AFG ; il reste une référence de conventions techniques validées (pile, découpage en `auth`/`core`/`game`/`socket`, patterns `app.ts`/`index.ts`, logger Winston partagé).

**Impact documentaire (déjà appliqué dans cette revue) :**
- AFG-DT-000 §1 : reformulé — BiLiA-V4 n'est plus « le point de départ concret », mais une référence de conventions.
- AFG-DT-001 §3 : la note « Alignement BiLiA-V4 » ne parle plus d'extraction mais de filiation de noms ; « extraction progressive » remplacé par « lot par lot ».
- AFG-DT-003 §1 principe 3 et intro : « Extraction progressive depuis BiLiA-V4 » remplacé par « Construction directe vers la cible, lot par lot ».
- `docs/README.md`, `modules/identity-service.md`, `modules/game-service.md`, `modules/realtime-service.md` : mentions « Évolution du service X de BiLiA-V4 » reformulées en « nom hérité, implémentation reconstruite from scratch ».

**Ce que ça change concrètement pour Lot 0 (AFG-DT-003) :** le lot « Fondations » ne consiste plus à extraire `shared`/`gateway` depuis du code existant, mais à les écrire depuis rien. C'est ce que fait le setup d'environnement livré avec cette revue (voir `services/`, `shared/`, `contracts/`, `sdk/` créés ce jour).

**Point ouvert — non tranché ici :** si BiLiA-V4 avait des utilisateurs/données en production, la suppression du code ne supprime pas ces données. Cette revue ne sait pas si c'est le cas. À trancher côté produit avant tout lancement AFG : migration de comptes existants, ou lancement à blanc.

---

## 2. Découpage du package `shared` en `@shared/core` / `@shared/ui` (2026-07-17)

**Constat :** `apps/bilia-landing-page|dashboard-parent|pwa-child` déclarent déjà une dépendance `"@shared/ui": "workspace:*"`, résolue dans `pnpm-lock.yaml` vers `link:../../shared/components`, et importent `@shared/ui/globals.css`. Le dossier `shared/` était vide. La fiche `modules/shared-and-sdk.md` (avant cette revue) documentait `shared/` comme **un seul package** contenant à la fois logger/middleware backend et composants React — alors que le lockfile déjà commité pointait vers un sous-package `shared/components`.

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
|---|---|---|---|
| 1 | `publishing-service.md` rejetait la dépendance `tournament` (« ? non ») alors que la matrice AFG-DT-002 §3 l'affichait en `S`, et n'affichait *aucune* dépendance vers `governance` alors que la fiche la présente comme centrale. | `AFG-DT-002` (matrice), `modules/publishing-service.md` | Matrice corrigée : `publishing → tournament = —`, `publishing → governance = S`. Fiche nettoyée du « ? non ». |
| 2 | `catalog-service.md` §6 omettait `governance` et `i18n`, présents dans la matrice AFG-DT-002 §3. | `modules/catalog-service.md` | Dépendances ajoutées à la fiche (badges labels/certification, contenu localisé). |
| 3 | `game-service.md` §6 omettait `ai`, présent dans la matrice. | `modules/game-service.md` | Dépendance `ai` ajoutée (égaliseur piloté IA, P3). |
| 4 | Entité `Channel` listée dans le modèle macro AFG-DT-001 §5 pour `notification`, absente de `notification-service.md` §3. | `modules/notification-service.md` | Entité `Channel` ajoutée. |
| 5 | Nommage divergent `GameListing` (AFG-DT-001 §5) vs `Listing` (`catalog-service.md` §3). | `modules/catalog-service.md` | Renommé en `GameListing` partout. |
| 6 | AFG-DT-002 §2.3 nommait l'app `apps/landing` ; le dossier réel est `apps/bilia-landing-page`. | `AFG-DT-002` | Corrigé. |
| 7 | Entités structurantes absentes du tableau macro AFG-DT-001 §5 bien que détaillées dans les fiches : `CurfewPolicy` (identity), `LevelAssignment` (game), `Match`/`Standing` (tournament). | `AFG-DT-001` §5 | Ajoutées aux lignes correspondantes. |
| 8 | `_TEMPLATE.md` prescrivait « Phase d'introduction » et « Port » (singulier strict) ; les 18 fiches réelles utilisent uniformément « Phase » (et `realtime-service.md` utilise légitimement « Ports » au pluriel, multi-port). | `modules/_TEMPLATE.md` | Gabarit aligné sur l'usage réel plutôt que l'inverse (moins de churn), avec note explicite sur le pluriel. |

**Non corrigé, assumé comme écart mineur :** les sections « 6. Dépendances » de `ai-service.md`, `governance-service.md`, `analytics-service.md` restent rédigées de façon abrégée (« quasiment tous », « notamment ») plutôt que de reproduire exhaustivement chaque cellule de la matrice AFG-DT-002 §3. Pas de contradiction franche détectée sur ces fiches, juste un niveau de détail inférieur — à corriger si un désaccord concret apparaît en implémentation.

---

## 4. Lacune identifiée : PWA offline-first non amorcée

**Constat :** AFG-DT-000 §3 (principe 10) et §4.2 exigent une PWA offline-first pour `apps/pwa-child`. Au moment de cette revue, `apps/pwa-child` était un scaffold Vite strictement identique aux deux autres apps (landing, dashboard-parent) : aucune dépendance PWA (`vite-plugin-pwa`, `workbox-*`), pas de manifest, pas de service worker.

**Décision :** traité comme partie du setup d'environnement de cette session plutôt que reporté au Lot 6 (AFG-DT-003) — coût faible, évite d'ajouter la dépendance PWA après coup sur une app qui aurait déjà grossi. Voir le scaffolding livré pour `apps/pwa-child`.

---

## 5. Points ouverts (arbitrage produit/business requis, non tranchés dans cette revue)

- **Sort des utilisateurs/données BiLiA-V4** existants en production, s'il y en a (cf. §1).
- **PSP Mobile Money exact** (AFG-DT-000 §7) — dépend des pays de lancement.
- **Fournisseur(s) LLM/IA** (AFG-DT-000 §7) — abstraction prévue, choix différé.
- **Bascule Kubernetes/Kafka** — déclenchée par la volumétrie réelle, pas par anticipation.
- **Wrappers mobiles natifs** — PWA jugée suffisante au MVP, à revisiter selon adoption.
- **Durées du Gantt AFG-DT-003 §2** — indicatives, à recaler une fois l'équipe et sa vélocité connues.

---

*Ce document est mis à jour à chaque revue de cohérence documentaire ou décision structurante prise hors du flux AFG-DT-000 → 003. Référencé par AFG-DT-000, AFG-DT-001, AFG-DT-003 et `modules/shared-and-sdk.md`.*
