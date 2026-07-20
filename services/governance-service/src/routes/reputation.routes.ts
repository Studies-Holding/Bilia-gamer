import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/governance-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const reputationRoutes: ExpressRouter = Router()

reputationRoutes.get('/:actorId', (_req, res) => {
  // score reputation
  res.status(501).json({ error: 'not_implemented', route: 'GET /reputation/:actorId' })
})

