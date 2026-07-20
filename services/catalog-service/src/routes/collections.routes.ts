import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/catalog-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const collectionsRoutes: ExpressRouter = Router()

collectionsRoutes.get('/', (_req, res) => {
  // nouveautes/populaires/recommandes
  res.status(501).json({ error: 'not_implemented', route: 'GET /collections' })
})

