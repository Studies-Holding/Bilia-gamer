import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/studio-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const componentsRoutes: ExpressRouter = Router()

componentsRoutes.get('/', (_req, res) => {
  // catalogue composants
  res.status(501).json({ error: 'not_implemented', route: 'GET /components' })
})

