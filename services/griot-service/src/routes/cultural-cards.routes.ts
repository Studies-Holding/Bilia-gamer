import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/griot-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const cultural_cardsRoutes: ExpressRouter = Router()

cultural_cardsRoutes.get('/:gameId', (_req, res) => {
  // contexte culturel du jeu
  res.status(501).json({ error: 'not_implemented', route: 'GET /cultural-cards/:gameId' })
})

