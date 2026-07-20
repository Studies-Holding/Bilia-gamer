import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/payment-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const subscriptionsRoutes: ExpressRouter = Router()

subscriptionsRoutes.post('/', (_req, res) => {
  // creation abonnement
  res.status(501).json({ error: 'not_implemented', route: 'POST /subscriptions' })
})

subscriptionsRoutes.put('/:id', (_req, res) => {
  // changement plan/statut
  res.status(501).json({ error: 'not_implemented', route: 'PUT /subscriptions/:id' })
})

