import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/ai-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const assistRoutes: ExpressRouter = Router()

assistRoutes.post('/player', (_req, res) => {
  // IA joueur (suggestions, aide)
  res.status(501).json({ error: 'not_implemented', route: 'POST /assist/player' })
})

assistRoutes.post('/creator', (_req, res) => {
  // IA createur (design, equilibrage)
  res.status(501).json({ error: 'not_implemented', route: 'POST /assist/creator' })
})

