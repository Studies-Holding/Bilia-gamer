import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/griot-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const proverbsRoutes: ExpressRouter = Router()

proverbsRoutes.get('/', (_req, res) => {
  // proverbes (filtre culture)
  res.status(501).json({ error: 'not_implemented', route: 'GET /proverbs' })
})

