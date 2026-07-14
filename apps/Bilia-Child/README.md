# apps/Bilia-Child — PWA enfant

## Rôle

L'app que l'enfant utilise au quotidien : connexion par Code Magique, choix du profil/thème, catalogue de jeux (embarqués en iframe via le SDK), progression (XP/rang/BiCoins/badges), boutique, Quick Chat, et respect du couvre-feu/temps de jeu (via `socket-service`).

## Ce qui existe déjà côté plateforme à consommer

| Besoin | Où |
| --- | --- |
| Connexion par Code Magique | `POST /api/auth/magic` (`auth-service`) |
| Profil courant, thème équipé | `GET /api/auth/me`, `PATCH /api/auth/profiles/:id` |
| Catalogue de jeux | `GET /api/games` (`game-service`) |
| Demander à jouer à un nouveau jeu | `POST /api/downloads/request` |
| Scores, XP, boutique, wallet | `services/core-service` (voir son README) |
| Thèmes visuels + variables CSS | `GET /api/themes/:id/css-vars` ou `shared/config/themes.config.ts` |
| Temps réel : couvre-feu, Quick Chat, défis | `socket-service` — se connecter en Socket.io et rejoindre `join:child` avec le `profileId`, écouter `time:lock`/`time:warning`/`chat:message`/`challenge:in`, envoyer un `time:heartbeat` toutes les minutes pendant le jeu |
| Communication avec un jeu embarqué (iframe) | `shared/sdk/bilia-sdk.ts` — le jeu appelle le SDK, qui `postMessage` vers la PWA parente |

## PWA — checklist technique

- `manifest.webmanifest` : nom, icônes (192/512 + maskable), couleur de thème, `display: standalone`, `start_url`.
- Service worker (`sw.js`) : cache-first pour les assets statiques et les jeux téléchargés (pour jouer hors-ligne une fois un jeu approuvé), network-first pour les appels API.
- `gateway/nginx.conf` sert déjà `sw.js` en `no-cache` et `manifest.webmanifest` avec le bon `Content-Type` — rien à changer côté Nginx, juste fournir les fichiers dans le build.
- Icônes et splash screens adaptés à un usage tablette/mobile enfant (tester l'installabilité avec Lighthouse).

## Animations : Motion

Utilisation de [Motion](https://motion.dev) pour :

- Les transitions entre écrans (accueil → catalogue → jeu)
- Les animations de gain d'XP/BiCoins, montée de niveau, déblocage de badge
- Les micro-interactions de la boutique (achat, équipement d'un item)
- Les alertes de temps (`time:warning`) — une animation douce plutôt qu'une simple pop-up brutale, adaptée à un public enfant

```bash
npm install motion
```
