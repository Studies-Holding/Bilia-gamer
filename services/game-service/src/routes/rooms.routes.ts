import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/game-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const roomsRoutes: ExpressRouter = Router()

roomsRoutes.post('/', (_req, res) => {
  // salle privee (code)
  res.status(501).json({ error: 'not_implemented', route: 'POST /rooms' })
})

roomsRoutes.get('/:code', (_req, res) => {
  // infos salle
  res.status(501).json({ error: 'not_implemented', route: 'GET /rooms/:code' })
})

