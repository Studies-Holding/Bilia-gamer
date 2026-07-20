import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/ai-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const translateRoutes: ExpressRouter = Router()

translateRoutes.post('/', (_req, res) => {
  // IA traduction
  res.status(501).json({ error: 'not_implemented', route: 'POST /translate' })
})

