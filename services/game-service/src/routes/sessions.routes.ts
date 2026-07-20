import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/game-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const sessionsRoutes: ExpressRouter = Router()

sessionsRoutes.post('/', (_req, res) => {
  // creer partie
  res.status(501).json({ error: 'not_implemented', route: 'POST /sessions' })
})

sessionsRoutes.post('/:id/join', (_req, res) => {
  // rejoindre
  res.status(501).json({ error: 'not_implemented', route: 'POST /sessions/:id/join' })
})

sessionsRoutes.post('/:id/leave', (_req, res) => {
  // quitter
  res.status(501).json({ error: 'not_implemented', route: 'POST /sessions/:id/leave' })
})

sessionsRoutes.post('/:id/resume', (_req, res) => {
  // reprendre
  res.status(501).json({ error: 'not_implemented', route: 'POST /sessions/:id/resume' })
})

sessionsRoutes.put('/:id/save', (_req, res) => {
  // sauvegarde
  res.status(501).json({ error: 'not_implemented', route: 'PUT /sessions/:id/save' })
})

sessionsRoutes.post('/:id/action', (_req, res) => {
  // action via moteur de regles
  res.status(501).json({ error: 'not_implemented', route: 'POST /sessions/:id/action' })
})

