# ROADMAP — shared

## ✅ Fait
- [x] Logger centralisé (Winston) + `httpLogger` middleware
- [x] Middleware d'auth mutualisé (`requireAuth`, `requireRole`) — remplace 3 copies dupliquées
- [x] Registre de thèmes (`THEMES_REGISTRY`) + conversion CSS vars
- [x] Types partagés + augmentation `Express.Request` (`user`, `requestId`)
- [x] Tests unitaires (middleware auth, logger, thèmes)

## 🚧 À faire
- [ ] Tests pour `sdk/bilia-sdk.ts` (mock `window.parent.postMessage`)
- [ ] Tests pour `lib/CookieManager.ts`
- [ ] Documenter précisément le protocole `postMessage` entre la PWA enfant et l'iframe du jeu (events envoyés/reçus)
- [ ] Étudier les *TypeScript project references* si `shared` grossit (build séparé avec `.d.ts`)
- [ ] Ajouter une validation de schéma (zod ?) sur `IProfile`/`IJwtPayload` pour éviter les incohérences entre services
- [ ] Exposer `sdk/bilia-sdk.ts` en package npm interne versionné si des jeux tiers externes (hors monorepo) doivent l'importer directement plutôt que via `<script>` servi par le gateway
