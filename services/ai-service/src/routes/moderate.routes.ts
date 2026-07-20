import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/ai-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const moderateRoutes: ExpressRouter = Router()

moderateRoutes.post('/', (_req, res) => {
  // IA moderation (pre-analyse)
  res.status(501).json({ error: 'not_implemented', route: 'POST /moderate' })
})

