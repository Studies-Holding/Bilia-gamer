import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/payment-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const payoutsRoutes: ExpressRouter = Router()

payoutsRoutes.get('/:creatorId', (_req, res) => {
  // reversements createur (P2)
  res.status(501).json({ error: 'not_implemented', route: 'GET /payouts/:creatorId' })
})

