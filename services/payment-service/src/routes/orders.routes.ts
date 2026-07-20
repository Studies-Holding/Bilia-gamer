import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/payment-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const ordersRoutes: ExpressRouter = Router()

ordersRoutes.post('/', (_req, res) => {
  // creation intention paiement (idempotent)
  res.status(501).json({ error: 'not_implemented', route: 'POST /orders' })
})

ordersRoutes.get('/:id', (_req, res) => {
  // statut commande
  res.status(501).json({ error: 'not_implemented', route: 'GET /orders/:id' })
})

