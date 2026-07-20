import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/studio-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const templatesRoutes: ExpressRouter = Router()

templatesRoutes.get('/', (_req, res) => {
  // catalogue templates
  res.status(501).json({ error: 'not_implemented', route: 'GET /templates' })
})

