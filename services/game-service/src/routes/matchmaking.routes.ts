import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/game-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const matchmakingRoutes: ExpressRouter = Router()

matchmakingRoutes.post('/tickets', (_req, res) => {
  // demande appariement
  res.status(501).json({ error: 'not_implemented', route: 'POST /matchmaking/tickets' })
})

matchmakingRoutes.delete('/tickets/:id', (_req, res) => {
  // annulation
  res.status(501).json({ error: 'not_implemented', route: 'DELETE /matchmaking/tickets/:id' })
})

