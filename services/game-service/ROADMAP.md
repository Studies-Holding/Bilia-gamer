# ROADMAP — game-service

## Fait

- [x] Logger centralisé branché
- [x] Middleware d'auth déduppliqué → `shared/middleware/auth.ts`
- [x] Split `app.ts`/`index.ts`
- [x] Tests health-check + routes protégées + 404

## À faire

- [ ] Scan antivirus / validation de contenu à l'upload d'un jeu (actuellement seul `multer` limite taille/type de fichier)
- [ ] Vérification que `entryPoint` du manifest correspond bien à un fichier existant dans l'archive uploadée
- [ ] Tests d'intégration avec `mongodb-memory-server` pour le workflow complet demande → approbation → cache
- [ ] Notifier `socket-service` en temps réel quand une demande de téléchargement est créée/approuvée/refusée (actuellement, la PWA doit re-poller `/downloads/status`)
- [ ] Bascule vers un stockage objet (S3-compatible) pour `storage/games/` en production plutôt que le disque local du conteneur
- [ ] Pagination sur `/games` (catalogue) et `/downloads/history`
