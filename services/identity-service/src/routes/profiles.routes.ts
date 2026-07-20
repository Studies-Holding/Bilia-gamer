import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/identity-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const profilesRoutes: ExpressRouter = Router()

profilesRoutes.put('/:id/curfew', (_req, res) => {
  // couvre-feu par profil
  res.status(501).json({ error: 'not_implemented', route: 'PUT /profiles/:id/curfew' })
})

