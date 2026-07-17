# Module — `notification-service`

**Phase :** MVP · **Port :** 5009 · **Base :** MongoDB `notification`

## 1. Responsabilité
Émettre les notifications multi-canal (in-app, push, email, SMS) et maintenir le lien entre joueurs, familles, créateurs et institutions. Le push temps réel transite par `realtime-service`.

## 2. Périmètre fonctionnel par phase
- **MVP :** invitation, achat, message, mise à jour ; templates ; préférences par canal ; respect du contrôle parental (invitations à valider).
- **Phase 2 :** anniversaires, tournois, nouveaux jeux, défis ; regroupement/anti-spam ; planification.
- **Phase 3 :** notifications intelligentes pilotées par IA (moment/canal optimal).

## 3. Entités / modèles principaux
- `Notification` : destinataire, type, canal(aux), statut, payload.
- `Channel` : canal support (in-app/push/email/sms), configuration fournisseur, statut actif.
- `Template` : gabarits localisés (i18n) par type.
- `ChannelPreference` : préférences utilisateur par canal.
- `DeliveryLog` : suivi d'envoi/lecture.

## 4. API principales
- `POST /notifications` (interne, depuis les services)
- `GET /notifications/:userId`, `PUT /notifications/:id/read`
- `GET/PUT /preferences/:userId`

## 5. Événements
- **Produits :** `NotificationCreated` (→ realtime pour push).
- **Consommés :** `GamePublished`, `PaymentSucceeded`, `InvitationSent`, `TournamentScheduled`, `SessionEnded`, etc.

## 6. Dépendances
- **S :** `identity` (destinataires + parental), `i18n` (templates localisés).
- Externes : fournisseurs push (FCM/APNs), email, SMS.

## 7. Arborescence
```
services/notification-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{notification,preference}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── notification.service.ts
│   │   ├── template.service.ts        # rendu localisé
│   │   └── dispatch.service.ts        # routage multi-canal
│   ├── channels/                      # abstraction canaux
│   │   ├── channel.interface.ts
│   │   ├── inApp.ts · push.ts · email.ts · sms.ts
│   ├── models/{notification,template,preference}.model.ts
│   ├── events/consumers.ts
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. `Notification` + `Template` + abstraction canaux.
2. Canal in-app + push (via realtime) + préférences.
3. Consumers MVP (invitation, achat, message, mise à jour) + respect parental.
4. Email/SMS.
5. (P2) Types P2 + regroupement/anti-spam + planification.
6. (P3) Notifications intelligentes IA.
