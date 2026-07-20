import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/governance-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const validationsRoutes: ExpressRouter = Router()

validationsRoutes.post('/:submissionId/decide', (_req, res) => {
  // decision de publication
  res.status(501).json({ error: 'not_implemented', route: 'POST /validations/:submissionId/decide' })
})

