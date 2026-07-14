# ROADMAP — landing-page

## À faire (rien de fait, dossier vide par choix)

- [ ] Initialiser le projet (Vite + React + TS conseillé) et créer son `package.json`
- [ ] Ajouter `"landing-page"` aux `workspaces` du `package.json` racine
- [ ] Installer et intégrer **Motion** (animations hero, CTA, scroll)
- [ ] Section présentation des thèmes/jeux (peut consommer `GET /api/themes` et `GET /api/games`)
- [ ] Formulaire d'inscription → `POST /api/auth/register` (`auth-service`)
- [ ] Liens vers les sous-domaines `bilia.` (PWA enfant) et `parent.` (dashboard)
- [ ] SEO de base (meta tags, sitemap, Open Graph)
- [ ] Build de prod branché sur `gateway/nginx.conf` (`root /var/www/landing`)
