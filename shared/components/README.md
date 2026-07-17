# @shared/ui

Bibliothèque de composants React (base shadcn/ui), hooks partagés et `globals.css` (variables de thème générées
depuis `@shared/core/src/themes/registry.ts`). Consommée par `apps/*`.

Pas d'étape de build requise en dev : les exports pointent directement vers les sources TS/TSX (`src/`), résolues
par esbuild/Vite comme n'importe quel autre package workspace. `pnpm build` ne fait que régénérer `globals.css` et
typechecker.

```bash
pnpm --filter @shared/ui run generate:css   # régénère globals.css après modif de THEMES_REGISTRY
pnpm --filter @shared/ui run typecheck
```

Voir `docs/modules/shared-and-sdk.md` §A et `docs/AFG-DT-004_decisions-ouvertes.md` §2.
