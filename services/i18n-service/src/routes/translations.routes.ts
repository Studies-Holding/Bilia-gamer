import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/i18n-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const translationsRoutes: ExpressRouter = Router()

translationsRoutes.get('/:localeCode', (_req, res) => {
  // dictionnaire
  res.status(501).json({ error: 'not_implemented', route: 'GET /translations/:localeCode' })
})

