import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/social-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const friendshipsRoutes: ExpressRouter = Router()

friendshipsRoutes.post('/', (_req, res) => {
  // invitation ami
  res.status(501).json({ error: 'not_implemented', route: 'POST /friendships' })
})

friendshipsRoutes.get('/:profileId', (_req, res) => {
  // liste amis
  res.status(501).json({ error: 'not_implemented', route: 'GET /friendships/:profileId' })
})

