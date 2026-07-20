import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/payment-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const webhooksRoutes: ExpressRouter = Router()

webhooksRoutes.post('/psp/:provider', (_req, res) => {
  // callback Mobile Money/carte
  res.status(501).json({ error: 'not_implemented', route: 'POST /webhooks/psp/:provider' })
})

