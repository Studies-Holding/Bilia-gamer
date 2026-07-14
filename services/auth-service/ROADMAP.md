# ROADMAP — auth-service

## Fait

- [x] Logger centralisé branché (`src/logger.ts` + `httpLogger`)
- [x] Middleware d'auth déduppliqué → `shared/middleware/auth.ts`
- [x] Split `app.ts`/`index.ts` pour rendre le service testable
- [x] Tests : `xpToLevel`/`xpToRank` (unitaires) + health-check/route protégée (intégration)
- [x] Correction du bug de build `rootDir` (excluait `shared/`)

## À faire

- [ ] Endpoint de renouvellement de Code Magique (actuellement généré une seule fois à la création)
- [ ] Rate-limiting dédié et plus strict sur `/login` et `/magic` (anti brute-force)
- [ ] Vérification d'email (actuellement `email` est juste unique, pas confirmé)
- [ ] Tests d'intégration avec `mongodb-memory-server` pour `register`/`login`/`magic` (actuellement seule la logique pure + le 401 sans token sont testés, pas les scénarios avec base de données)
- [ ] Refresh token / rotation de JWT (actuellement un seul token à durée fixe `JWT_EXPIRES`)
- [ ] Suppression de compte parent (cascade sur les profils enfants et leurs données dans les autres services)
- [ ] Documenter le format exact des erreurs de validation Mongoose renvoyées telles quelles (`String(e)`) — à structurer proprement
