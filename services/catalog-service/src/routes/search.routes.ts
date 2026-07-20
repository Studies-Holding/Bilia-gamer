import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/catalog-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const searchRoutes: ExpressRouter = Router()

searchRoutes.get('/', (_req, res) => {
  // recherche (indexation SearchIndex)
  res.status(501).json({ error: 'not_implemented', route: 'GET /search' })
})

