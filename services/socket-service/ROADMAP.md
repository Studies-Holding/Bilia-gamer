# ROADMAP — socket-service

## Fait

- [x] Logger centralisé branché (connexions/déconnexions/join tracés)
- [x] Extraction de `isCurfewActive` dans `src/utils/timeGuard.ts` (testable)
- [x] Tests unitaires complets sur la logique de couvre-feu (6 cas, dont les plages traversant minuit)

## À faire

- [ ] Authentifier les sockets (actuellement `join:parent`/`join:child` font confiance à l'ID fourni par le client — vérifier le JWT à la connexion `io.use(...)`)
- [ ] Extraire `checkTimeGuard` (et les modèles `TimeConfig`/`DailyUsage`) dans des fichiers séparés pour pouvoir la tester avec `mongodb-memory-server`, comme `isCurfewActive`
- [ ] Endpoint REST (ou événement) pour que le parent configure `TimeConfig` depuis le dashboard (actuellement pas de route visible — à vérifier si elle existe côté `core-service` ou si elle manque)
- [ ] Rejouer les minutes manquées si un heartbeat est raté (déconnexion Wi-Fi) plutôt que de perdre le décompte
- [ ] Historiser les `challenge:send` (actuellement volatile, rien n'est persisté en base)
- [ ] Limiter le débit de `chat:send`/`challenge:send` par profil (anti-spam)
