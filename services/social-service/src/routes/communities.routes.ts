import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/social-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const communitiesRoutes: ExpressRouter = Router()

communitiesRoutes.post('/', (_req, res) => {
  // creation communaute/club
  res.status(501).json({ error: 'not_implemented', route: 'POST /communities' })
})

communitiesRoutes.get('/:id/messages', (_req, res) => {
  // chat persistant
  res.status(501).json({ error: 'not_implemented', route: 'GET /communities/:id/messages' })
})

