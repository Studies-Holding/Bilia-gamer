import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/game-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const achievementsRoutes: ExpressRouter = Router()

achievementsRoutes.get('/:profileId', (_req, res) => {
  // succes du profil
  res.status(501).json({ error: 'not_implemented', route: 'GET /achievements/:profileId' })
})

