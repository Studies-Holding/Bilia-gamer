# Module : `identity-service`

**Phase :** MVP · **Port :** 5001 · **Base :** MongoDB `identity`
*(Nom hérité du service `auth` de BiLiA-V4 ; implémentation reconstruite from scratch, cf. AFG-DT-004 §1.)*

## 1. Responsabilité

Gérer l'identité, l'authentification, les profils, les **familles** (jusqu'à 7 profils), le **contrôle parental / couvre-feu**, et l'autorisation (RBAC) de tout l'écosystème.

## 2. Périmètre fonctionnel par phase

- **MVP :** inscription/connexion, tokens access/refresh, gestion de profils, groupes familiaux, contrôle parental (plafonds d'achat, temps de jeu, validation d'invitations), **couvre-feu** (plages horaires), rôles (joueur, parent, créateur, studio, enseignant, entreprise, institution, traducteur, validateur, modérateur, admin).
- **Phase 2 :** comptes organisationnels (école, entreprise, institution) avec hiérarchie (proviseur → enseignants → classes ; RH → collaborateurs), SSO/OAuth externes, MFA.
- **Phase 3 :** fédération d'identité partenaires, gestion fine des consentements par juridiction.

## 3. Entités / modèles principaux

- `User` : credentials, statut, rôles, langue, pays, consentements.
- `Profile` : avatar, âge (si autorisé), niveau, préférences, rattaché à un `User`/`Family`.
- `Family` : titulaire, membres (≤7), politiques d'achat.
- `ParentalControl` : plafonds, restrictions, invitations à valider.
- `CurfewPolicy` : plages horaires par profil (logique pure réutilisable `timeGuard`).
- `Organization` (P2) : école/entreprise/institution + membres.
- `Role`, `Permission` : RBAC.

## 4. API principales

- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- `GET/PUT /profiles/:id`, `POST /families`, `POST /families/:id/members`
- `GET/PUT /parental-control/:profileId`, `GET/PUT /curfew/:profileId`
- `POST /authz/check` (vérification permission), `GET /users/me`
- `POST /introspect` (utilisé par le gateway)

## 5. Événements

- **Produits :** `UserRegistered`, `ProfileCreated`, `FamilyUpdated`, `CurfewChanged`, `ParentalControlChanged`.
- **Consommés :** `PaymentSucceeded` (mise à jour droits/abonnement), `SubscriptionChanged`.

## 6. Dépendances

- **S :** aucun service métier en amont (fondation).
- Consommé par : tous (via gateway/introspection). `game`/`realtime` interrogent le couvre-feu ; `payment` les plafonds.
- Externes : Redis (sessions, blacklist tokens), fournisseur MFA (P2).

## 7. Arborescence

```text
services/identity-service/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── logger.ts
│   ├── config/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── family.routes.ts
│   │   └── parental.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── token.service.ts
│   │   ├── family.service.ts
│   │   └── rbac.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── profile.model.ts
│   │   ├── family.model.ts
│   │   └── parentalControl.model.ts
│   ├── utils/timeGuard.ts        # couvre-feu (pur, testable)
│   ├── events/
│   └── middleware/
├── tests/
│   ├── auth.test.ts
│   ├── profile.model.test.ts
│   └── timeGuard.test.ts
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module

1. Modèles `User`/`Profile` + auth (access/refresh) + hashing sécurisé.
2. RBAC (rôles/permissions) + endpoint `/authz/check` + introspection.
3. Familles (≤7 profils) + rattachement profils.
4. Contrôle parental + `timeGuard` (couvre-feu) + tests unitaires purs.
5. Événements identité + intégration gateway.
6. (P2) Organisations hiérarchiques + SSO/OAuth + MFA.
7. (P3) Consentements par juridiction + fédération partenaires.
