import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/tournament-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const seasonsRoutes: ExpressRouter = Router()

seasonsRoutes.post('/', (_req, res) => {
  // creation saison
  res.status(501).json({ error: 'not_implemented', route: 'POST /seasons' })
})

