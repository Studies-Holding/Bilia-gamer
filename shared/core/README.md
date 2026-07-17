# @shared/core

Socle backend partagé AFG : logger (Winston + `httpLogger`), middleware (`auth`, `errorHandler`, `validate`),
hiérarchie d'erreurs, types transverses, taxonomies (jeux/compétences), `THEMES_REGISTRY` + génération CSS,
utilitaires purs (`timeGuard`), event bus (Redis Streams).

Consommé par `services/*`. Voir `docs/modules/shared-and-sdk.md` §A et `docs/AFG-DT-004_decisions-ouvertes.md` §2
pour la justification du découpage avec `@shared/ui`.

```bash
pnpm --filter @shared/core test
pnpm --filter @shared/core build
```
