import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/governance-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const ip_claimsRoutes: ExpressRouter = Router()

ip_claimsRoutes.post('/', (_req, res) => {
  // revendication PI
  res.status(501).json({ error: 'not_implemented', route: 'POST /ip-claims' })
})

