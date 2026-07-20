import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/publishing-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const submissionsRoutes: ExpressRouter = Router()

submissionsRoutes.post('/', (_req, res) => {
  // depot jeu (cycle de vie 10 etapes)
  res.status(501).json({ error: 'not_implemented', route: 'POST /submissions' })
})

submissionsRoutes.get('/:id', (_req, res) => {
  // statut
  res.status(501).json({ error: 'not_implemented', route: 'GET /submissions/:id' })
})

submissionsRoutes.post('/:id/checks', (_req, res) => {
  // controles auto (technique/securite)
  res.status(501).json({ error: 'not_implemented', route: 'POST /submissions/:id/checks' })
})

submissionsRoutes.post('/:id/versions', (_req, res) => {
  // nouvelle version
  res.status(501).json({ error: 'not_implemented', route: 'POST /submissions/:id/versions' })
})

