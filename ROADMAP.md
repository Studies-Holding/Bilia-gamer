# ROADMAP — BiLiA (globale)

Jalons transverses, qui touchent plusieurs modules à la fois. Chaque module a en plus son propre `ROADMAP.md` pour le détail local.

## Fait (refacto en cours)

- [x] Logger centralisé (Winston) branché sur les 4 microservices, `httpLogger` sur chaque route
- [x] Suppression des 3 copies dupliquées de `middleware/auth.ts` → un seul `shared/middleware/auth.ts`
- [x] Séparation `app.ts` (Express testable) / `index.ts` (bootstrap Mongo + listen) sur les 3 services REST
- [x] Extraction de la logique pure de couvre-feu (`isCurfewActive`) dans `socket-service/src/utils/timeGuard.ts`
- [x] Jest + ts-jest + Supertest sur `shared` et les 4 services (46 tests)
- [x] `package.json` racine avec `workspaces` + scripts `install-all`/`build-all`/`test-all`/`dev`
- [x] Correction du bug de build (`rootDir` qui excluait `shared/` du programme TypeScript)
- [x] README + ROADMAP pour chaque module

## À faire

### Frontend

- [ ] Initialiser `landing-page`, `apps/Bilia-Child`, `apps/Bilia-Parent` (Vite + React)
- [ ] Intégrer **Motion** (ex-Framer Motion) sur la landing page et les deux apps — transitions de pages, micro-interactions, animations de la boutique/rangs/badges
- [ ] Ajouter les 3 apps au tableau `workspaces` du `package.json` racine une fois leur `package.json` créé
- [ ] Manifest PWA + service worker sur `apps/Bilia-Child` (et éventuellement `apps/Bilia-Parent`)

### Infra / Déploiement

- [ ] `docker-compose.yml` (4 services + Mongo + Nginx) — actuellement absent, seul `gateway/nginx.conf` existe
- [ ] Génération des certificats SSL (`gateway/ssl/`, voir son README)
- [ ] CI (GitHub Actions) : `npm run test-all` + `npm run build-all` sur chaque PR
- [ ] Monitoring : brancher `LOG_COLLECTOR_URL` sur un vrai collecteur (Loki/Elastic) en prod

### Qualité

- [ ] Étendre la couverture de tests aux contrôleurs (actuellement : health-checks + logique pure uniquement)
- [ ] Ajouter des tests d'intégration avec `mongodb-memory-server` pour les routes qui touchent la DB
- [ ] Lint partagé (ESLint + config commune) — pas encore mis en place
- [ ] Réduire les vulnérabilités npm signalées par `npm audit` (3 actuellement, dont `multer@1.x`)

### Documentation

- [ ] Schéma de données Mongo par service (actuellement uniquement dans les modèles Mongoose)
- [ ] Guide de contribution pour les créateurs de jeux tiers (au-delà du `dev-template/README.md`)
