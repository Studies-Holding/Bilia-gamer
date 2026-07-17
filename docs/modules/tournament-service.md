# Module — `tournament-service`

**Phase :** P2 · **Port :** 5013 · **Base :** MongoDB `tournament`

## 1. Responsabilité
Gérer les **tournois, saisons et événements** (compétitions individuelles/équipes, écoles, entreprises). S'appuie sur le moteur de règles de `game-service` pour l'exécution des matchs.

## 2. Périmètre fonctionnel par phase
- **Phase 2 :** création de tournois (brackets, round-robin), inscription (gratuite ou frais en Jetons), saisons, événements, classements, récompenses ; tournois d'entreprise/école.
- **Phase 3 :** tournois cross-plateforme, ligues récurrentes, événements sponsorisés, API Tournois publique complète.

## 3. Entités / modèles principaux
- `Tournament` : format, participants, brackets, statut, récompenses.
- `Season` : période, classement cumulé, récompenses de fin de saison.
- `Event` : événement thématique/culturel daté.
- `Match` : rencontre planifiée (déléguée à game pour l'exécution).
- `Standing` : classements.

## 4. API principales
- `POST /tournaments`, `POST /tournaments/:id/register`
- `GET /tournaments/:id/bracket`, `GET /tournaments/:id/standings`
- `POST /seasons`, `GET /events`

## 5. Événements
- **Produits :** `TournamentScheduled`, `TournamentMatchScheduled`, `TournamentEntryRequested` (→ payment), `TournamentEnded`.
- **Consommés :** `SessionEnded` (résultats de match), `PaymentSucceeded` (inscription).

## 6. Dépendances
- **S :** `game` (exécution des matchs), `payment` (frais/récompenses), `identity` (participants/orgs).
- Émet vers `notification`, `analytics`.

## 7. Arborescence
```
services/tournament-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{tournament,season,event}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── tournament.service.ts
│   │   ├── bracket.service.ts         # génération/avancement brackets (pur)
│   │   └── season.service.ts
│   ├── models/{tournament,season,event,match,standing}.model.ts
│   ├── events/
│   └── utils/
├── tests/
│   └── bracket.test.ts                # tests purs
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. `Tournament` + formats + génération de brackets (logique pure testée).
2. Inscription (gratuit/Jetons) + intégration payment.
3. Exécution des matchs via game + remontée des résultats.
4. Classements + récompenses + saisons + événements.
5. Tournois d'entreprise/école.
6. (P3) Ligues, cross-plateforme, API Tournois publique.
