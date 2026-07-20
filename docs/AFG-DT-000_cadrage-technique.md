# AFG-DT-000 : Cadrage Technique Global

**African Games Framework : Plateforme Bilibilia**
**Version :** b4 · 20.07.2026 · **Statut :** Design de référence technique
**Rattachement :** décline **AFG-000** (Vision, reçu 20.07.2026) et **AFG-001** (CDCF, reçu 20.07.2026) sur le plan technique ; s'appuie également sur **AFG-002** (Architecture Fonctionnelle), **AFG-003** (Architecture Technique), **AFG-004** (AFG Game SDK Specification) et **AFG-005** (AFG Game Studio), reçus le 17.07.2026.

---

## 1. Objet du document

Ce document traduit la vision stratégique (AFG-000) et le cahier des charges fonctionnel (AFG-001) en **décisions techniques structurantes**. Il fixe les principes d'architecture, la pile technologique, les contraintes non fonctionnelles et le découpage en domaines. Il sert de socle aux documents :

- **AFG-DT-001** : Architecture globale
- **AFG-DT-002** : Catalogue des modules & mapping fonctionnel
- **AFG-DT-003** : Roadmap de conception
- **AFG-DT-004** : Décisions ouvertes & journal des arbitrages
- **AFG-DT-005** : Moteur runtime et temps réel
- **`modules/*`** : Architecture, arborescence et roadmap de chaque service

**AFG, plateforme générique vs Bilibilia, produit** : AFG-002/003/004/005 décrivent **AFG (African Games Framework)** comme un framework/écosystème générique (SDK, Game Studio, certification, marketplaces multiples) ; **Bilibilia** est le premier produit/déploiement construit sur ce framework, avec son propre catalogue et sa propre marque. Les documents `AFG-DT-*` de ce dépôt couvrent la construction de Bilibilia sur les fondations AFG ; les capacités génériques du framework (SDK complet ~30 modules, Studio, badges de certification) sont documentées comme cible, phasées selon leur propre roadmap (cf. AFG-DT-002 §3bis, `modules/shared-and-sdk.md` §B, `modules/studio-service.md`).

**BiLiA-V4** (prototype antérieur : monorepo TypeScript, microservices Express `auth`/`core`/`game`/`socket`, MongoDB par service, Socket.io, gateway Nginx, logger Winston partagé, `bilia-sdk`, `THEMES_REGISTRY`, BiCoins, couvre-feu) a validé ces choix technologiques mais **son code n'est pas conservé dans ce dépôt** (abandonné le 2026-07-17, décision actée en AFG-DT-004 §1). AFG **reconstruit chaque service from scratch** à sa forme cible, en reprenant les conventions techniques éprouvées de BiLiA-V4 (pile, découpage, patterns) sans étape d'extraction de code.

---

## 2. De la vision aux contraintes techniques

Chaque conviction du CDCF impose une contrainte d'ingénierie. Le tableau ci-dessous rend cette traçabilité explicite.

| Principe fonctionnel (AFG-000 / AFG-001) | Conséquence technique structurante |
| --- | --- |
| Écosystème, pas une application | Architecture **microservices** par domaine métier, non un monolithe. Ouverture par **API publiques** dès la conception. |
| Créateurs au cœur, sans redévelopper l'infra | **SDK** client + **services transverses** (comptes, parties, sauvegarde, paiement) exposés de façon stable et versionnée. |
| Jeu intergénérationnel & diaspora | **Temps réel** robuste (Socket.io) tolérant à la latence/instabilité réseau ; **synchronisation multi-écrans** ; sessions reprenables. |
| Réalités africaines (paiement, réseau, langues) | **Mobile Money** en priorité ; mode dégradé/**offline-first** (PWA) ; **i18n** multilingue incluant langues africaines. |
| Compétences mesurables (IDC) | Modèle de données **taxonomie + IDC** partagé, alimenté par créateur → éditorial → communauté → IA (5 niveaux). |
| IA assiste sans remplacer | **Orchestrateur IA** isolé, sous garde-fous, décisions importantes gardées sous contrôle humain (validation, modération). |
| Inclusion & accessibilité | Accessibilité (WCAG) traitée comme exigence produit, pas option ; lecture vocale, contrastes, navigation simplifiée. |
| Protection des enfants | **Contrôle parental** et **couvre-feu** centralisés, appliqués de bout en bout (achats, temps de jeu, invitations). |
| Marché durable pour créateurs | **Wallet + Jetons (BiCoins)**, partage de revenus, statistiques créateur, gouvernance (labels, certification, PI). |

---

## 3. Principes d'architecture

1. **Domain-Driven, bounded contexts.** Chaque service possède un domaine métier clair, sa base MongoDB, son cycle de vie. Pas de base partagée entre services.
2. **API-first & contrats explicites.** Chaque service expose un contrat (OpenAPI / types partagés). Les APIs publiques (AFG-001 §38) sont un produit à part entière, versionnées (`/v1`).
3. **Monorepo, workspaces.** Un dépôt, packages `services/*`, `shared/*`, `apps/*`, `sdk/*`. Types et logique commune factorisés dans `shared`.
4. **Communication : synchrone + asynchrone.**
   - Synchrone (HTTP/REST via gateway) pour les requêtes utilisateur.
   - Asynchrone (**event bus**) pour les effets de bord découplés : publication de jeu → indexation catalogue → recalcul IDC → analytics → notifications.
5. **Temps réel séparé du transactionnel.** Le service temps réel (Socket.io) gère parties, présence, chat live ; il ne porte pas la vérité métier persistante, il la relaie.
6. **Testabilité native.** Séparation `app.ts` (Express pur, testable via supertest) / `index.ts` (bootstrap). Logique métier pure extraite en modules purs (ex. `timeGuard.isCurfewActive`). Jest + ts-jest + supertest par service.
7. **Observabilité par défaut.** Logger Winston partagé, `httpLogger` sur chaque service, corrélation par `requestId`, métriques et traces prévues dès le MVP.
8. **Sécurité & vie privée dès la conception.** Auth centralisée, RBAC, gestion des consentements, minimisation des données, chiffrement des secrets.
9. **Progressivité MVP → P2 → P3.** Aucune sur-ingénierie : les services P2/P3 (Game Studio, IA avancée, cloud gaming) sont prévus dans les frontières mais implémentés par lots.
10. **Frontends découplés (PWA).** Landing, PWA joueur (Bilia-Child), dashboard parent/créateur/admin consomment les mêmes APIs. Offline-first pour le joueur.

---

## 4. Pile technologique

### 4.1 Backend

- **Langage :** TypeScript (strict) partout.
- **Runtime :** Node.js LTS.
- **Framework HTTP :** Express (microservices, ports 5001+).
- **Temps réel :** Socket.io.
- **Persistance :** MongoDB (une base par service) via Mongoose. Redis pour cache, présence, files légères, rate-limiting.
- **Event bus :** Redis Streams / NATS au MVP → montée vers Kafka si volumétrie l'exige (P2/P3).
- **Gateway :** Nginx (reverse proxy, TLS, routage, rate-limit) → complété par une couche API Gateway applicative pour l'auth et l'agrégation.
- **Recherche :** MongoDB Atlas Search / OpenSearch pour le catalogue (recherche multicritère).
- **Logs :** Winston (shared/logger) + agrégation centralisée.

### 4.2 Frontend

- **Web / PWA :** **React 19** + Vite (choisi et déjà scaffoldé dans `apps/*`) en **PWA** (service worker, offline-first, installable).
- **Design system :** `THEMES_REGISTRY` + génération de variables CSS (thématisation par univers/pass culturels).
- **Mobile :** PWA d'abord ; wrappers natifs Android/iOS en P2/P3 (Capacitor ou natif selon besoin).
- **Animation :** intégration d'une librairie de motion (landing + apps).
- **Éditeur natif C++ (P3) :** `apps/studio-editor-native` : GDExtension **C++20** sur **Godot Engine** (moteur MIT, non forké), pour les créateurs Niveau 3-4 du Game Studio. Ne remplace pas le Studio web ; second client de la même API `studio-service`. Cf. AFG-DT-001 ADR-11.

### 4.3 Moteur de jeu & runtime temps réel (jeux d'action)

- Voir **AFG-DT-005** (pile moteur/runtime) : rendu **Babylon.js** (client) + **NullEngine** headless (serveur) pour les jeux d'action/3D, physique **Havok** par défaut / **Rapier** en option déterministe, réseau **bi-transport** (**geckos.io** UDP/WebRTC pour l'action, **Socket.io** pour le tour-par-tour/social : cas majoritaire du catalogue), STUN/TURN (**coturn**) uniquement là où geckos.io est utilisé.

### 4.4 IA

- Orchestrateur IA (service dédié) appelant des modèles (LLM + modèles spécialisés reco/modération). Abstraction fournisseur pour ne pas coupler la plateforme à un provider.

### 4.5 Paiement

- Agrégateur Mobile Money (Orange Money, MTN MoMo, Moov, Wave, Airtel) via PSP africain (ex. type agrégateur pan-africain) + cartes (Visa/Mastercard) + virements. Wallet et Jetons **internes** à la plateforme.

### 4.6 DevOps

- Conteneurisation Docker, orchestration (Docker Compose en dev → Kubernetes en prod P2+), CI/CD (lint, test, build, scan), IaC, environnements dev/staging/prod.

---

## 5. Exigences non fonctionnelles (NFR)

| Domaine | Exigence cible |
| --- | --- |
| **Performance** | API < 200 ms p95 (hors IA) ; latence temps réel de jeu < 150 ms perçue via optimistic updates. |
| **Disponibilité** | 99,5 % MVP → 99,9 % P2 sur services critiques (identity, catalog, payment, realtime). |
| **Résilience réseau** | Mode dégradé/offline pour la PWA joueur ; reprise de partie ; retry idempotent des paiements. |
| **Scalabilité** | Services stateless horizontalement scalables ; temps réel scalé via adapter Redis pour Socket.io. |
| **Sécurité** | OWASP ASVS, RBAC, chiffrement en transit (TLS) et au repos (données sensibles), gestion secrets. |
| **Vie privée / conformité** | Consentements, minimisation, droit à l'effacement ; attention particulière aux données de mineurs. |
| **Accessibilité** | WCAG 2.1 AA sur les parcours clés ; lecture vocale, contrastes, sous-titres. |
| **Internationalisation** | i18n complet, RTL-ready, extensible aux langues africaines (Ewondo, Douala, Fulfuldé, etc.). |
| **Observabilité** | Logs structurés corrélés, métriques (RED/USE), traces distribuées, alerting. |
| **Testabilité** | Couverture ciblée : unitaire (logique pure), intégration (supertest), e2e sur parcours critiques. |

---

## 6. Sécurité des mineurs & confiance (transversal)

Contrainte prioritaire du CDCF. Traitée comme **préoccupation transverse** appliquée par plusieurs services :

- **Contrôle parental & couvre-feu** portés par `identity-service`, appliqués au runtime par `game-service`/`realtime-service` (blocage de session hors plage horaire), aux achats par `payment-service`, aux invitations par `social-service`.
- **Modération** (IA + humaine) sur contenus, chat, jeux publiés.
- **Validation avant publication** (technique, sécurité, éditoriale, culturelle, compétences) dans `publishing-service`.
- **Protection des données** : consentements et minimisation centralisés, journalisation des accès.

---

## 7. Ce que ce cadrage NE fige pas encore

- Le choix exact du PSP Mobile Money (dépend des pays cibles du lancement).
- Le fournisseur de modèles IA (abstraction prévue).
- Le passage Kubernetes / Kafka (déclenché par la volumétrie réelle en P2).
- Les wrappers natifs mobiles (PWA suffisante au MVP).
- Le sort des données/comptes utilisateurs BiLiA-V4 s'il en existe en production (le code est abandonné, la question des données n'a pas été tranchée : voir AFG-DT-004 §3, point ouvert).
- **AFG-000 (Vision) et AFG-001 (CDCF)** reçus le 20.07.2026 : rapprochement effectué (cf. AFG-DT-004 §8) : cohérent avec AFG-002/003/004/005, quelques ajouts intégrés (certification de confiance des créateurs, protection PI, labels CDCF, IA Business/Découverte Culturelle, APIs publiques nommées).
- **AFG-002 à AFG-024** : la série CDCF (AFG-001, conclusion) annonce des documents jusqu'à AFG-024 ; 6 documents reçus à ce jour (000-005) sur une série d'environ 25. AFG-006/AFG-009 toujours non référencés (réservés ou inexistants) ; AFG-007/008/010 attendus, contenu inconnu.

Ces points sont des **décisions différées assumées**, documentées comme telles pour être tranchées au bon moment sans bloquer le MVP.

---

*Suite : AFG-DT-001 (architecture globale) détaille la vue conteneurs, les flux d'événements et l'infrastructure.*
