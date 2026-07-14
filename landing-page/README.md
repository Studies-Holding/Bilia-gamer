# landing-page  Site vitrine

## Rôle

Site public (marketing) : présentation de BiLiA, argumentaire parents, liens vers l'inscription et vers `bilia.bilia.com` (PWA enfant) / `parent.bilia.com` (dashboard).

## Attendu côté intégration

- Servi par Nginx sur `bilia.com` (voir `gateway/nginx.conf` — `root /var/www/landing`, fallback SPA, cache 1 an sur les assets).
- Une fois initialisé avec un `package.json`, ajoute `"landing-page"` au tableau `workspaces` du `package.json` racine, et une entrée dans `apps` de `scripts/build-all.js` si besoin (déjà prévu — `build-all.js apps` inclut `landing-page`).
- Script `build` attendu produisant un dossier statique (`dist/` par défaut avec Vite).

## Animations : Motion

Utilisation de [Motion](https://motion.dev) (ex-Framer Motion) pour :

- Les transitions d'entrée des sections (hero, fonctionnalités, témoignages)
- Les micro-interactions sur les CTA ("Essayer gratuitement", "Voir la démo")
- D'éventuelles animations de scroll (`whileInView`) pour dynamiser la présentation des thèmes/jeux

```bash
npm install motion
```

## Ce qui existe déjà côté plateforme

- Thèmes visuels (`shared/config/themes.config.ts`) et leurs variables CSS (`themeToCSSVars`) — utile si la landing veut prévisualiser les thèmes disponibles dans la boutique.
- Endpoint public `GET /api/themes` (`core-service`) si tu préfères charger les thèmes dynamiquement plutôt que de dupliquer le registre côté front.
