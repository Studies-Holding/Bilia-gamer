import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/catalog-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const gamesRoutes: ExpressRouter = Router()

gamesRoutes.get('/', (_req, res) => {
  // liste/recherche multicritere
  res.status(501).json({ error: 'not_implemented', route: 'GET /games' })
})

gamesRoutes.get('/:id', (_req, res) => {
  // fiche jeu
  res.status(501).json({ error: 'not_implemented', route: 'GET /games/:id' })
})

