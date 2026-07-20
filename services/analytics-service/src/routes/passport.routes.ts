import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/analytics-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const passportRoutes: ExpressRouter = Router()

passportRoutes.get('/:profileId', (_req, res) => {
  // Passeport Ludique
  res.status(501).json({ error: 'not_implemented', route: 'GET /passport/:profileId' })
})

