import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/catalog-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const access_grantsRoutes: ExpressRouter = Router()

access_grantsRoutes.post('/', (_req, res) => {
  // octroi de droit acces (interne, post-paiement)
  res.status(501).json({ error: 'not_implemented', route: 'POST /access-grants' })
})

