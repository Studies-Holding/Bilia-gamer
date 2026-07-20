import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/governance-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const moderationRoutes: ExpressRouter = Router()

moderationRoutes.post('/:reportId/decide', (_req, res) => {
  // decision humaine
  res.status(501).json({ error: 'not_implemented', route: 'POST /moderation/:reportId/decide' })
})

