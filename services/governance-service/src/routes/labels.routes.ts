import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/governance-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const labelsRoutes: ExpressRouter = Router()

labelsRoutes.get('/:gameId', (_req, res) => {
  // labels du jeu
  res.status(501).json({ error: 'not_implemented', route: 'GET /labels/:gameId' })
})

