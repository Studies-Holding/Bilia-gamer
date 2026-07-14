# dev-template — Kit de développement pour un jeu tiers

Template autonome pour créer un mini-jeu éducatif compatible BiLiA : squelette HTML/CSS/TS, SDK simplifié, et un petit serveur de dev avec **tunnel HTTPS automatique** pour tester le jeu depuis un vrai téléphone/tablette sans déploiement.

Ce dossier est indépendant du reste du monorepo (il n'importe pas `shared/` directement) : c'est le point de départ que tu donnerais à un créateur de jeu externe.

## Contenu

- `index.html` / `style.css` — squelette de jeu (canvas, overlay de fin de partie...)
- `src/main.ts` — boucle de jeu d'exemple (`startGame`, `loop`, `update`, `render`, `spawnTarget`, gestion pointeur, timer, pause/reprise, écran de fin)
- `src/bilia-sdk.ts` — version simplifiée du SDK (`shared/sdk/bilia-sdk.ts`) : thèmes, `sendScore`/`finishGame`, difficulté adaptative
- `bilia.config.json` — manifest du jeu (id, nom, catégorie, tranche d'âge, compétences, `entryPoint`)
- `tunnel-server.js` — serveur de dev avec 3 modes :
  - `npm run dev` → sert le jeu en local + rechargement à chaud (chokidar + WebSocket) + tunnel HTTPS (`localtunnel`) + QR code à scanner
  - `npm run preview` → tunnel seul, sans watch
  - `npm run publish` → envoie le manifest + l'URL du tunnel à `game-service` (`POST /api/games/register-dev`)

## Démarrer un nouveau jeu

```bash
cd dev-template
npm install
cp bilia.config.json bilia.config.json.bak   # garde une trace, puis édite le tien
npm run dev
```

Un QR code s'affiche dans le terminal : scanne-le avec la PWA enfant (ou un navigateur mobile) pour tester le jeu en conditions réelles, y compris caméra/micro (MediaPipe, synthèse vocale) qui nécessitent HTTPS.

## Variables d'environnement

```text
BILIA_DEV_PORT=7000                  # port local du jeu
BILIA_GAME_SERVICE_URL=http://localhost:5003
BILIA_TUNNEL_SUBDOMAIN=mon-jeu       # sous-domaine localtunnel personnalisé
# BILIA_TUNNEL_PROVIDER=ngrok        # alternative si localtunnel est instable
```

## Build

```bash
npm run build   # tsc --noEmit (vérifie juste les types, pas de bundler ici)
```
