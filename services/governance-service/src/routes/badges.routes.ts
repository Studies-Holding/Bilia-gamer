import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/governance-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const badgesRoutes: ExpressRouter = Router()

badgesRoutes.post('/:gameId/evaluate', (_req, res) => {
  // evaluation des 7 badges AFG
  res.status(501).json({ error: 'not_implemented', route: 'POST /badges/:gameId/evaluate' })
})

