# apps/Bilia-Parent — Dashboard parent (à initialiser)

Dossier volontairement vide : c'est à toi de l'initialiser (`npm create vite@latest . -- --template react-ts` conseillé). Ce README documente ce qui est attendu pour bien s'intégrer au reste de la plateforme.

## Rôle

L'espace que le parent utilise pour : créer/gérer les profils enfants, approuver les demandes de jeux, configurer le temps d'écran/couvre-feu, consulter les rapports d'analyse (temps de jeu, compétences travaillées, progression).

## Ce qui existe déjà côté plateforme à consommer

| Besoin | Où |
| --- | --- |
| Connexion / inscription parent | `POST /api/auth/login`, `POST /api/auth/register` (`auth-service`) |
| Gestion des profils enfants | `GET/POST/PATCH /api/auth/profiles` |
| Demandes de jeux en attente | `GET /api/downloads/pending`, `PATCH /api/downloads/:id/approve OU reject (`game-service`) |
| Rapports d'analyse | `GET /api/analytics/:profileId/report`, `/timeline`, `/games` (`core-service`) |
| Configuration du temps d'écran / couvre-feu | `socket-service` (modèle `TimeConfig`) — **à exposer via une route REST dédiée si ce n'est pas déjà le cas**, voir `services/socket-service/ROADMAP.md` |
| Notifications temps réel (nouvelle demande de jeu, etc.) | Se connecter en Socket.io et rejoindre `join:parent` avec le `userId`, écouter les événements pertinents |

## PWA

`gateway/nginx.conf` sert déjà `parent.VOTRE_DOMAINE.com` avec une CSP renforcée (`X-Frame-Options: DENY`). Rendre ce dashboard installable (manifest + service worker) est optionnel mais recommandé pour un usage mobile confortable.

## Animations : Motion

Utilisation de [Motion](https://motion.dev) pour :

- Les transitions entre sections du dashboard (profils, jeux, analytics, réglages)
- Les graphiques de progression (courbes de temps de jeu, radar de compétences) — Motion s'intègre bien avec des libs de graphes (ex. Recharts) pour animer l'apparition des données
- Les confirmations d'action (approbation/refus d'un jeu) avec un retour visuel clair

```bash
npm install motion
```
