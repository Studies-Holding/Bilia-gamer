# Module : `wallet-service`

**Phase :** MVP · **Port :** 5017 · **Base :** MongoDB `wallet`

## 1. Responsabilité

Détenir et faire évoluer le **solde monnaie** et le **solde Jetons (BiCoins)** de chaque profil/famille. Seul service autorisé à modifier un solde. Extrait de `payment-service` le 17.07.2026 pour respecter la règle stricte d'AFG-002 (ch.22/32/33) : le paiement ne doit jamais manipuler un solde directement (cf. AFG-DT-001 ADR-09, AFG-DT-004 §6).

## 2. Périmètre fonctionnel par phase

- **MVP :** solde monnaie (crédité par `payment` après paiement réussi), Jetons (BiCoins) : achat/dépense/grand livre, débit/crédit synchrones exposés en interne à `payment`/`game`, remboursements.
- **Phase 2 :** cartes/codes cadeaux, coupons, cashback (règles simples), crédit de gains de tournois (`tournament`), crédit de récompenses (`achievement`/`skills-idc`).
- **Phase 3 :** règles de fidélité avancées, conversion multi-devises internes, interopérabilité avec des Wallets partenaires (écosystème AFG plus large).

## 3. Entités / modèles principaux

- `Wallet` : solde monnaie + solde Jetons, par `profileId` (et vue agrégée par `familyId`).
- `TokenLedger`/`BiCoinsLedger` : grand livre append-only de tous les mouvements (émission, dépense, remboursement, cashback), avec référence à l'opération d'origine (`orderId`, `tournamentId`, etc.).
- `GiftCard`/`Coupon` (P2) : codes cadeaux et coupons, statut d'utilisation.
- `CashbackRule` (P2) : règles de cashback simples (pourcentage, plafond).

## 4. API principales

- `GET /wallets/:profileId` : solde courant.
- `POST /wallets/:profileId/credit` (interne, appelé par `payment`/`tournament`/`game`) : idempotent (`operationId`).
- `POST /wallets/:profileId/debit` (interne, appelé par `payment`) : idempotent, refuse si solde insuffisant.
- `GET /wallets/:profileId/ledger` : historique des mouvements.
- `POST /giftcards/redeem` (P2)

## 5. Événements

- **Produits :** `WalletCredited`, `WalletDebited`, `TokensGranted`.
- **Consommés :** `PaymentSucceeded` (crédit initial si topup), `TournamentPrizeAwarded` (P2), `AchievementUnlocked` (P2, récompenses en Jetons).

## 6. Dépendances

- **S :** `identity` (existence du profil + plafonds parentaux d'achat, appliqués avant tout débit).
- `wallet-service` est lui-même un **dépendant entrant** (S) pour `payment`, `game` (récompenses P2) et `tournament` (gains P2) : il n'appelle pas ces services, il est appelé par eux.
- Émet vers `notification` (alerte solde bas, crédit reçu), `analytics`.

## 7. Arborescence

```text
services/wallet-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── config/
│   ├── routes/{wallet,giftcard}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── wallet.service.ts          # crédit/débit, invariants comptables
│   │   ├── ledger.service.ts          # grand livre append-only
│   │   └── giftcard.service.ts        # P2
│   ├── models/{wallet,ledger,giftcard}.model.ts
│   ├── events/
│   └── utils/idempotency.ts
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module

1. Modèle `Wallet` + `TokenLedger` + invariants comptables (solde jamais négatif, opérations idempotentes).
2. Endpoints internes `credit`/`debit` (idempotent via `operationId`), consommés par `payment-service`.
3. Application des plafonds parentaux (lecture `identity`) avant tout débit.
4. Historique/grand livre exposé (`GET /wallets/:profileId/ledger`).
5. Événements `WalletCredited`/`WalletDebited`/`TokensGranted` + alertes `notification`.
6. (P2) Cartes/codes cadeaux, coupons, cashback, crédit gains tournois/récompenses.
7. (P3) Fidélité avancée, multi-devises internes, interopérabilité Wallets partenaires.
