# Module — `social-service`

**Phase :** P2 · **Port :** 5010 · **Base :** MongoDB `social`

## 1. Responsabilité
Infrastructure sociale : amis, invitations, **salles privées (persistance)**, groupes familiaux, **communautés**, **clubs**, chat persistant et messages vocaux. Le live transite par `realtime` ; ce service détient l'historique et les graphes sociaux.

## 2. Périmètre fonctionnel par phase
- **MVP (partiel via identity/realtime) :** amis, invitations, salles privées, groupes familiaux (peuvent démarrer côté identity/realtime).
- **Phase 2 :** chat persistant, messages vocaux, communautés, clubs, modération sociale (déléguée à governance/ai).
- **Phase 3 :** événements communautaires, streaming social, diaspora (fuseaux/langues).

## 3. Entités / modèles principaux
- `Friendship`, `Invitation`
- `Community`, `Club` (membres, rôles, règles)
- `ChatThread`, `ChatMessage`, `VoiceMessage` (métadonnées ; média en object storage)

## 4. API principales
- `POST /friends/request`, `POST /friends/:id/accept`
- `POST /invitations`, `GET /invitations/:userId`
- `POST /communities`, `POST /communities/:id/join`, `POST /clubs`
- `GET /threads/:id/messages`, `POST /threads/:id/messages`

## 5. Événements
- **Produits :** `InvitationSent`, `FriendshipCreated`, `CommunityActivity`.
- **Consommés :** `ProfileCreated`, `ModerationDecision` (governance/ai).

## 6. Dépendances
- **S :** `identity` (profils + parental), `governance`/`ai` (modération), `realtime` (live).
- Émet vers `notification`, `analytics`.

## 7. Arborescence
```
services/social-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{friend,invitation,community,club,chat}.routes.ts
│   ├── controllers/
│   ├── services/{friendship,community,chat}.service.ts
│   ├── models/{friendship,invitation,community,club,chatMessage}.model.ts
│   ├── events/
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. Amis + invitations (extraction depuis identity/realtime si démarré là).
2. Communautés + clubs (membres/rôles).
3. Chat persistant + intégration realtime pour le live.
4. Messages vocaux (média en object storage).
5. Modération sociale (hooks governance/ai).
6. (P3) Événements communautaires + streaming + fonctionnalités diaspora.
