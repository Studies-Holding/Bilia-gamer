# Module : `payment-service`

**Phase :** MVP · **Port :** 5006 · **Base :** MongoDB `payment`

## 1. Responsabilité

Gérer les transactions : **Mobile Money**, cartes, virements, **abonnements**, achats, cadeaux et **répartition des revenus créateurs**. Ne détient et ne modifie **jamais** un solde directement : tout crédit/débit du Wallet passe par un appel synchrone à `wallet-service` (AFG-002 ch.22/32/33, cf. AFG-DT-001 ADR-09). Aucun créateur ne manipule jamais directement les transactions.

## 2. Périmètre fonctionnel par phase

- **MVP :** Mobile Money (Orange, MTN, Moov, Wave, Airtel) via PSP, cartes (Visa/Mastercard), abonnements Solo/Famille, achats idempotents, répartition revenus créateurs (v0), remboursements (créditent le Wallet via `wallet-service`).
- **Phase 2 :** Pass thématiques, abonnements Créateur/Entreprise/Institution, cartes/codes cadeaux (émis via `wallet-service`), virements entreprises, licences multiples, payouts créateurs.
- **Phase 3 :** abonnements dynamiques (formule optimale suggérée par IA), place de marché B2B, revenus assets/composants.

## 3. Entités / modèles principaux

- `Order` : intention + statut (idempotencyKey), lignes, moyen de paiement.
- `Subscription` : Solo/Famille/Pass/Créateur/Entreprise/Institution, cycle, statut.
- `PaymentIntent` / `Transaction` : suivi PSP, callbacks retry-safe.
- `Payout` / `RevenueShare` : reversement créateur, commissions.

> `Wallet` et `TokenLedger` (BiCoins) ont été extraits vers `wallet-service` le 17.07.2026 (cf. AFG-DT-004 §6). `payment-service` ne possède plus ces agrégats.

## 4. API principales

- `POST /orders` (idempotent), `GET /orders/:id`
- `POST /subscriptions`, `PUT /subscriptions/:id`
- `POST /webhooks/psp/:provider` (callbacks Mobile Money)
- `GET /payouts/:creatorId` (P2)

> Les anciens endpoints `GET /wallet/:userId`, `POST /wallet/:userId/topup`, `POST /tokens/purchase`, `POST /tokens/spend` sont déplacés vers `wallet-service` (voir `modules/wallet-service.md` §4).

## 5. Événements

- **Produits :** `PaymentSucceeded`, `PaymentFailed`, `SubscriptionChanged`, `RevenueShared`.
- **Consommés :** `GamePublished` (prix/commission), `TournamentEntryRequested` (frais).

## 6. Dépendances

- **S :** `identity` (utilisateur + plafonds parentaux), `governance` (statut créateur pour payout), **`wallet` (débit/crédit du solde et des Jetons pour tout paiement en BiCoins ou remboursement : appel synchrone obligatoire, jamais d'accès direct au solde)**.
- Émet vers `catalog` (droit d'accès), `analytics`, `notification`.
- Externes : PSP Mobile Money, processeur cartes, banque (virements).

## 7. Arborescence

```text
services/payment-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{order,subscription,webhook,payout}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── order.service.ts           # idempotence
│   │   ├── subscription.service.ts
│   │   ├── revenue.service.ts         # répartition créateurs
│   │   └── walletClient.service.ts    # client HTTP interne vers wallet-service
│   ├── providers/                     # abstraction PSP
│   │   ├── psp.interface.ts
│   │   ├── orangeMoney.ts · mtnMomo.ts · wave.ts · card.ts
│   ├── models/{order,subscription,payout}.model.ts
│   ├── events/
│   └── utils/idempotency.ts
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module

1. `Order` idempotent + abstraction PSP (interface).
2. Client interne vers `wallet-service` (débit/crédit synchrone) + gestion des refus (solde insuffisant).
3. Intégration Mobile Money (1 PSP) + webhooks retry-safe.
4. Abonnements Solo/Famille.
5. `PaymentSucceeded` → droit d'accès (catalog) + répartition revenus v0.
6. Application des plafonds parentaux + remboursements via `wallet-service`.
7. (P2) Pass thématiques, abonnements pro, cadeaux (émis via `wallet-service`), payouts créateurs.
8. (P3) Abonnements dynamiques IA, B2B, revenus assets.
