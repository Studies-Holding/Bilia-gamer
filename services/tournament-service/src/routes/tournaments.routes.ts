import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/tournament-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const tournamentsRoutes: ExpressRouter = Router()

tournamentsRoutes.post('/', (_req, res) => {
  // creation tournoi
  res.status(501).json({ error: 'not_implemented', route: 'POST /tournaments' })
})

tournamentsRoutes.post('/:id/register', (_req, res) => {
  // inscription
  res.status(501).json({ error: 'not_implemented', route: 'POST /tournaments/:id/register' })
})

tournamentsRoutes.get('/:id/bracket', (_req, res) => {
  // bracket
  res.status(501).json({ error: 'not_implemented', route: 'GET /tournaments/:id/bracket' })
})

tournamentsRoutes.get('/:id/standings', (_req, res) => {
  // classement
  res.status(501).json({ error: 'not_implemented', route: 'GET /tournaments/:id/standings' })
})

