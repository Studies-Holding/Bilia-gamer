# ROADMAP — apps/Bilia-Parent

## À faire (rien de fait, dossier vide par choix)

- [ ] Initialiser le projet (Vite + React + TS)
- [ ] Ajouter `"apps/Bilia-Parent"` aux `workspaces` du `package.json` racine
- [ ] Connexion/inscription parent + gestion des profils enfants
- [ ] File d'attente des demandes de jeux (approuver/refuser) avec notification temps réel (Socket.io, `join:parent`)
- [ ] Écrans d'analyse (temps de jeu, radar de compétences, historique) branchés sur `core-service`
- [ ] Réglages du temps d'écran / couvre-feu par profil (nécessite d'exposer une route REST côté `socket-service`, voir son `ROADMAP.md`)
- [ ] Boutique/BiCoins en lecture seule pour supervision parentale
- [ ] Intégration **Motion** (transitions, graphiques animés)
- [ ] Tests (Vitest/Testing Library) une fois le projet initialisé
