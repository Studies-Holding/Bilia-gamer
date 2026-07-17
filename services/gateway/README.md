# gateway

Routage, auth edge, rate-limit, agrégation (cf. AFG-DT-001 §3).

Port : `5000`. Voir `docs/modules/gateway.md` pour la responsabilité, le périmètre fonctionnel, les
entités, l'API, les événements et les dépendances de ce service.

```bash
pnpm --filter gateway run dev
pnpm --filter gateway run test
```
