# ROADMAP — dev-template

## À faire

- [ ] Vérifier que `POST /api/games/register-dev` existe bien côté `game-service` (non trouvé dans `services/game-service/src/routes/index.ts` actuel — probablement à ajouter comme route dev-only, protégée ou désactivée en production)
- [ ] `npm run build` ne fait qu'un `tsc --noEmit` : ajouter un vrai bundler (esbuild/Vite) si les jeux tiers doivent grossir au-delà d'un seul fichier
- [ ] Générer automatiquement `bilia.config.json` via un prompt interactif (`npm create bilia-game`) plutôt que de dupliquer le fichier à la main
- [ ] Ajouter un exemple utilisant `onHandDetected`/`onPoseDetected` (MediaPipe) et `speak()` pour montrer aux créateurs tiers comment utiliser les capteurs
- [ ] Documenter le format exact attendu par le zip uploadé sur `game-service` (structure de dossiers, taille max, `entryPoint`)
- [ ] Tests automatisés pour `tunnel-server.js` (au moins la lecture du manifest et la construction du payload de publication)
