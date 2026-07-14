# gateway — Nginx reverse-proxy

Point d'entrée HTTPS unique de la plateforme. Un seul fichier de config (`nginx.conf`) qui route 3 domaines vers les fichiers statiques des fronts et vers les 4 microservices.

## Domaines routés

|---|---|---|
| `bilia.com` | `landing-page` (statique) | Cache 1 an sur les assets, fallback SPA |
| `bilia.bilia.com` | `apps/Bilia-Child` (PWA) | Headers sécurité PWA, `sw.js` en `no-cache`, `manifest.webmanifest`, `/sdk/` en CORS ouvert, `/games/` en cache 30 jours |
| `parent.bilia.com` | `apps/Bilia-Parent` | CSP renforcée (`X-Frame-Options: DENY`) |

Chaque domaine proxy les mêmes routes API vers les 4 upstreams :

```text
upstream auth   { server auth-service:5001;   keepalive 16; }
upstream core   { server core-service:5002;   keepalive 16; }
upstream game   { server game-service:5003;   keepalive 16; }
upstream socket { server socket-service:5004; keepalive 32; }
```

- `/api/auth`, `/api/profiles` → `auth`
- `/api/scores`, `/api/shop`, `/api/themes`, `/api/analytics` → `core`
- `/api/games`, `/api/downloads` → `game`
- `/api/time`, `/socket.io/` (upgrade WebSocket) → `socket`

Le trafic HTTP (port 80) est systématiquement redirigé vers HTTPS.

## SSL

`gateway/ssl/` doit contenir `fullchain.pem` et `privkey.pem` (voir `gateway/ssl/README.txt`) — générés par exemple via :

```bash
certbot certonly --standalone -d bilia.votre-domaine.com
```

**Ne jamais committer les certificats** (déjà exclu par `.gitignore` : `docker/ssl/`).

## Utilisation en dev

En développement, chaque service tourne directement sur son port (5001-5004) et les fronts sur leur port Vite (5173/5174) — Nginx n'est utile qu'en préproduction/production (ou dans un `docker-compose.yml`, à créer, voir `ROADMAP.md`).
