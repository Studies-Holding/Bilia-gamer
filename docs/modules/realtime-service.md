# Module — `realtime-service`

**Phase :** MVP · **Ports :** 5005 (Socket.io/WS) + 9208 signalisation geckos + plage UDP (ex. 10000-20000) · **Base :** Redis (présence, rooms) — pas de vérité métier persistante
*(Nom hérité du service `socket` de BiLiA-V4 ; implémentation reconstruite from scratch, cf. AFG-DT-004 §1. Voir AFG-DT-005.)*

## 1. Responsabilité
Assurer le **temps réel bi-transport** et router vers `game-service` pour les jeux d'action nécessitant une simulation autoritative. Deux transports coexistent : **Socket.io (WebSocket/TCP)** pour le tour-par-tour, la présence, le lobby et le chat ; **geckos.io (UDP/WebRTC)** pour les jeux d'**action** (snapshot interpolation + encodage binaire). Relaie l'état porté par `game-service` ; ne détient pas la vérité métier persistante. Applique le **couvre-feu** au niveau connexion.

> **Rappel (AFG-DT-005) :** geckos.io = UDP via WebRTC (pas WebSocket). Le bon transport dépend du type de jeu (matrice §5 de DT-005) : quiz/cartes/awalé → Socket.io ; football/action 3D → geckos.io.

## 2. Périmètre fonctionnel par phase
- **MVP :** connexions **Socket.io** authentifiées (tour-par-tour, présence, salles, couvre-feu, push), rooms live, broadcast d'état (adapté par niveau via égaliseur), reprise. Amorce **geckos.io** pour les premiers jeux d'action (canal UDP + snapshot interpolation).
- **Phase 2 :** chat live + messages vocaux (relais), synchronisation multi-écrans, geckos.io généralisé aux jeux d'action + prédiction/réconciliation, STUN/TURN (coturn) en production.
- **Phase 3 :** visioconférence/streaming (SFU externe), synchronisation cross-plateforme avancée.

## 3. Entités / modèles principaux
En mémoire/Redis : `Connection`, `LiveRoom`, `Presence`. Aucun agrégat persistant propre (délègue à `game`, `social`, `notification`).

## 4. Interfaces (événements socket, pas REST)
- `connect` (JWT), `join_room`, `leave_room`
- `game_action` → transmis à `game-service`, `game_state` (broadcast)
- `presence_update`, `chat_message` (P2), `voice_message` (P2)
- `notification` (push temps réel)

## 5. Événements (bus)
- **Produits :** `PlayerPresenceChanged`, `RoomActivity`.
- **Consommés :** `SessionStarted/Ended` (game), `NotificationCreated` (notification → push), `CurfewChanged` (identity → déconnexion/limitation).

## 6. Dépendances
- **S :** `game` (appliquer actions/état), `identity` (auth + couvre-feu).
- Externes : Redis (adapter Socket.io pour scaler horizontalement), STUN/TURN (coturn, pour geckos.io), SFU/visio externe (P3).

## 7. Arborescence
```
services/realtime-service/
├── src/
│   ├── app.ts                    # init serveur socket (testable)
│   ├── index.ts
│   ├── logger.ts
│   ├── config/socket.ts
│   ├── transports/
│   │   ├── socket/               # Socket.io (tour-par-tour, présence, chat)
│   │   │   ├── game.gateway.ts · presence.gateway.ts · chat.gateway.ts
│   │   └── geckos/               # geckos.io (UDP action)
│   │       ├── action.channel.ts
│   │       ├── snapshot.ts       # @geckos.io/snapshot-interpolation
│   │       └── schema.ts         # typed-array-buffer-schema (binaire)
│   ├── middleware/auth.socket.ts # JWT + couvre-feu (les 2 transports)
│   ├── services/
│   │   ├── room.service.ts
│   │   ├── presence.service.ts
│   │   └── broadcast.service.ts
│   ├── adapters/redis.adapter.ts # scaling multi-instance socket
│   ├── ice/                      # config STUN/TURN (coturn)
│   ├── events/                   # bus consumers/producers
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. Serveur **Socket.io** + auth JWT + adapter Redis (scaling) — couvre le tour-par-tour.
2. Rooms live + présence + join/leave + couvre-feu (consumer `CurfewChanged`).
3. Relais `game_action` ↔ `game-service` + broadcast d'état + push notifications.
4. Amorce **geckos.io** (canal UDP) + `snapshot-interpolation` + schéma binaire sur un 1er jeu d'action.
5. (P2) STUN/TURN (coturn) en prod + prédiction/réconciliation + geckos généralisé ; chat live + messages vocaux.
6. (P3) Visio/streaming (SFU) + sync cross-plateforme.
