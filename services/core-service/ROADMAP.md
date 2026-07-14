# ROADMAP — core-service

## ✅ Fait
- [x] Logger centralisé branché
- [x] Middleware d'auth déduppliqué → `shared/middleware/auth.ts`
- [x] Split `app.ts`/`index.ts`
- [x] Tests health-check + routes publiques/protégées + 404

## 🚧 À faire
- [ ] Tests d'intégration avec `mongodb-memory-server` pour `submitScore`/`buyItem`/`equipItem` (logique métier réelle avec DB)
- [ ] Vérifier l'atomicité de `buyItem` (débit wallet + ajout inventaire dans une transaction Mongo)
- [ ] Pagination sur `/scores/history` et `/analytics/:profileId/timeline` (actuellement pas de limite visible)
- [ ] Cache (mémoire ou Redis) sur `/themes` et `/scores/leaderboard/:gameId` — données peu volatiles, forte lecture
- [ ] Webhook ou event Socket.io vers `socket-service` quand un profil gagne un badge/niveau (actuellement pas de notification temps réel depuis core-service)
- [ ] Valider les montants BiCoins côté serveur avec un schéma strict (zod) pour éviter tout achat à prix falsifié
