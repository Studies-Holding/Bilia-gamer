import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/realtime-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const presenceRoutes: ExpressRouter = Router()

presenceRoutes.get('/:roomCode', (_req, res) => {
  // liste des presents (debug/admin)
  res.status(501).json({ error: 'not_implemented', route: 'GET /presence/:roomCode' })
})

