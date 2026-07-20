import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/i18n-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const translation_jobsRoutes: ExpressRouter = Router()

translation_jobsRoutes.post('/', (_req, res) => {
  // demande traduction (communaute puis IA)
  res.status(501).json({ error: 'not_implemented', route: 'POST /translation-jobs' })
})

