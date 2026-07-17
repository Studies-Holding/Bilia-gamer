# Bilia-gamer — AFG (African Games Framework) · Plateforme Bilibilia

Monorepo TypeScript (pnpm workspaces) : microservices Express, MongoDB (une base par service), Redis, Socket.io, Nginx, frontends React/Vite en PWA.

La conception technique complète vit dans [`docs/`](./docs/README.md) — commencer par [`docs/README.md`](./docs/README.md), qui indique l'ordre de lecture des documents AFG-DT-000 à 005 et des fiches par module.

## Démarrage rapide

```bash
corepack enable        # ou : npm i -g pnpm@11.13.0
pnpm install-all        # = pnpm install
cp .env.example .env
docker compose up -d    # mongo, mongo-express, redis, mailhog
pnpm dev                 # lance tous les packages ayant un script "dev"
```

Autres scripts racine : `pnpm build-all`, `pnpm test-all`, `pnpm lint`, `pnpm typecheck`, `pnpm new:service <nom> <port>` (gabarit d'un nouveau service, cf. `scripts/create-service.mjs`).

`docker compose up -d` ne lance que l'infra stateful (mongo, redis, mailhog) : les services Node tournent en local via `pnpm dev` pour un rechargement rapide. Pour valider le Dockerfile d'un service avant staging : `docker compose --profile app up -d --build` (conteneurise `gateway` + `nginx`).

## Arborescence

```text
apps/         # clients : landing, pwa-child (Bilia-Child), dashboard-parent, ...
services/     # microservices Express (un port, une base Mongo chacun)
shared/
  core/       # @shared/core — logger, middleware, types, taxonomies, thèmes (backend)
  components/ # @shared/ui — composants React, hooks, globals.css (frontend)
sdk/          # bilia-sdk — SDK client des jeux
contracts/    # schémas d'événements + OpenAPI (source de vérité inter-services)
nginx/        # config gateway edge
infra/        # IaC, CI/CD, k8s (P2+)
docs/         # conception technique (AFG-DT-*, fiches modules/)
```

## État du projet

BiLiA-V4 (prototype antérieur) a été abandonné le 2026-07-17 — la plateforme est reconstruite from scratch à sa forme cible. Voir [`docs/AFG-DT-004_decisions-ouvertes.md`](./docs/AFG-DT-004_decisions-ouvertes.md) pour le détail de cette décision et le suivi des points ouverts.
