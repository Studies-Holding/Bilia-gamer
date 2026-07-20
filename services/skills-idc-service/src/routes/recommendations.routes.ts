import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/skills-idc-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const recommendationsRoutes: ExpressRouter = Router()

recommendationsRoutes.get('/:profileId', (_req, res) => {
  // moteur de recommandation
  res.status(501).json({ error: 'not_implemented', route: 'GET /recommendations/:profileId' })
})

