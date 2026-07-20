# Module : `gateway`

**Phase :** MVP · **Port :** 5000 (edge) · **Base :** aucune (stateless, cache Redis)

## 1. Responsabilité

Point d'entrée unique de la plateforme : terminaison TLS, routage vers les services, authentification en périphérie, rate-limiting, agrégation légère et exposition des **APIs publiques** (AFG-001 §38).

## 2. Périmètre fonctionnel par phase

- **MVP :** reverse proxy Nginx + couche applicative (validation JWT, injection des claims RBAC, routage, rate-limit, CORS, journalisation corrélée `requestId`).
- **Phase 2 :** APIs publiques versionnées (`/v1`) Catalogue, Comptes, Paiement, Tournois, IDC, Analytics ; quotas par clé d'API partenaire.
- **Phase 3 :** APIs Griot/Traduction/IA, agrégation type BFF pour clients spécifiques, portail développeur.

## 3. Entités / modèles principaux

Aucun agrégat métier. Gère : routes déclaratives, politiques de rate-limit, clés d'API partenaires (référencées, stockage délégué à `identity`/`governance`).

## 4. API principales

- Toutes les routes `/api/*` proxifiées vers les services.
- `/v1/*` : APIs publiques (P2+).
- `/health`, `/ready`.

## 5. Événements

- **Produits :** aucun métier (émet des logs/métriques d'accès).
- **Consommés :** aucun.

## 6. Dépendances

- **S :** `identity` (introspection token). Tous les services en aval (routage).
- Externes : Redis (rate-limit, cache), Nginx.

## 7. Arborescence

```text
services/gateway/
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── logger.ts
│   ├── config/routes.ts          # table de routage déclarative
│   ├── middleware/
│   │   ├── auth.ts               # validation JWT + claims
│   │   ├── rateLimit.ts
│   │   └── cors.ts
│   ├── proxy/                    # règles de proxy applicatif
│   ├── public-api/               # handlers /v1 (P2+)
│   └── utils/
├── tests/
├── jest.config.js
├── Dockerfile
├── package.json
├── README.md
└── ROADMAP.md
```

## 8. Roadmap de conception du module

1. Config Nginx (TLS, upstreams, rate-limit de base).
2. Couche applicative : validation token + injection claims, CORS, `requestId`.
3. Table de routage déclarative vers services MVP.
4. Health/readiness + observabilité des accès.
5. (P2) APIs publiques `/v1` + gestion des clés partenaires + quotas.
6. (P3) BFF/agrégation + portail développeur.
