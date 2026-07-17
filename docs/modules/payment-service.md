# Module — `payment-service`

**Phase :** MVP · **Port :** 5006 · **Base :** MongoDB `payment`

## 1. Responsabilité
Gérer toute l'économie : **Mobile Money**, cartes, virements, **Wallet**, **Jetons (BiCoins)**, **abonnements**, achats, micro-transactions, cadeaux et **répartition des revenus créateurs**. Aucun créateur ne manipule jamais directement les transactions.

## 2. Périmètre fonctionnel par phase
- **MVP :** Mobile Money (Orange, MTN, Moov, Wave, Airtel) via PSP, cartes (Visa/Mastercard), Wallet, Jetons (BiCoins), abonnements Solo/Famille, achats idempotents, répartition revenus créateurs (v0), remboursements en Wallet.
- **Phase 2 :** Pass thématiques, abonnements Créateur/Entreprise/Institution, cartes/codes cadeaux, virements entreprises, licences multiples, payouts créateurs.
- **Phase 3 :** abonnements dynamiques (formule optimale suggérée par IA), place de marché B2B, revenus assets/composants.

## 3. Entités / modèles principaux
- `Wallet` : solde monnaie + solde Jetons par utilisateur.
- `Token`/`BiCoinsLedger` : grand livre des Jetons (émissions, dépenses, fidélité).
- `Order` : intention + statut (idempotencyKey), lignes, moyen de paiement.
- `Subscription` : Solo/Famille/Pass/Créateur/Entreprise/Institution, cycle, statut.
- `PaymentIntent` / `Transaction` : suivi PSP, callbacks retry-safe.
- `Payout` / `RevenueShare` : reversement créateur, commissions.

## 4. API principales
- `POST /orders` (idempotent), `GET /orders/:id`
- `GET /wallet/:userId`, `POST /wallet/:userId/topup`
- `POST /tokens/purchase`, `POST /tokens/spend`
- `POST /subscriptions`, `PUT /subscriptions/:id`
- `POST /webhooks/psp/:provider` (callbacks Mobile Money)
- `GET /payouts/:creatorId` (P2)

## 5. Événements
- **Produits :** `PaymentSucceeded`, `PaymentFailed`, `SubscriptionChanged`, `RevenueShared`, `TokensGranted`.
- **Consommés :** `GamePublished` (prix/commission), `TournamentEntryRequested` (frais).

## 6. Dépendances
- **S :** `identity` (utilisateur + plafonds parentaux), `governance` (statut créateur pour payout).
- Émet vers `catalog` (droit d'accès), `analytics`, `notification`.
- Externes : PSP Mobile Money, processeur cartes, banque (virements).

## 7. Arborescence
```
services/payment-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{order,wallet,token,subscription,webhook,payout}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── order.service.ts           # idempotence
│   │   ├── wallet.service.ts
│   │   ├── token.service.ts           # BiCoins ledger
│   │   ├── subscription.service.ts
│   │   └── revenue.service.ts         # répartition créateurs
│   ├── providers/                     # abstraction PSP
│   │   ├── psp.interface.ts
│   │   ├── orangeMoney.ts · mtnMomo.ts · wave.ts · card.ts
│   ├── models/{wallet,order,subscription,ledger,payout}.model.ts
│   ├── events/
│   └── utils/idempotency.ts
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. Modèles `Wallet` + `Token`(BiCoins) ledger + invariants comptables.
2. `Order` idempotent + abstraction PSP (interface).
3. Intégration Mobile Money (1 PSP) + webhooks retry-safe.
4. Jetons : achat/dépense + abonnements Solo/Famille.
5. `PaymentSucceeded` → droit d'accès (catalog) + répartition revenus v0.
6. Application des plafonds parentaux + remboursements Wallet.
7. (P2) Pass thématiques, abonnements pro, cadeaux, payouts créateurs.
8. (P3) Abonnements dynamiques IA, B2B, revenus assets.
