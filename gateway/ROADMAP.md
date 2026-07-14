# ROADMAP — gateway

## Fait

- [x] Routage des 3 domaines (vitrine, PWA enfant, dashboard parent) + 4 upstreams API
- [x] Redirection HTTP → HTTPS, headers de sécurité PWA, cache statique long

## À faire

- [ ] Remplacer `bilia.com` par le vrai nom de domaine avant mise en prod
- [ ] `docker-compose.yml` qui construit ce Nginx avec les bons volumes (`landing-page/dist`, `apps/Bilia-Child/dist`, `apps/Bilia-Parent/dist`, `services/game-service/storage/games`) — actuellement absent du repo
- [ ] Génération/renouvellement automatique des certificats (certbot en cron ou conteneur dédié)
- [ ] Limiter le débit sur `/api/*` au niveau Nginx en plus du rate-limit applicatif (défense en profondeur)
- [ ] Ajouter un healthcheck Nginx (`location /nginx-health`) pour l'orchestrateur (Docker/K8s)
- [ ] Vérifier la CSP de la vitrine et du dashboard parent une fois le choix de librairies front (Motion, polices, CDN) figé
