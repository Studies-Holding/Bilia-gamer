import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/notification-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const notificationsRoutes: ExpressRouter = Router()

notificationsRoutes.post('/', (_req, res) => {
  // envoi (interne, consomme evenements)
  res.status(501).json({ error: 'not_implemented', route: 'POST /notifications' })
})

notificationsRoutes.get('/:userId', (_req, res) => {
  // historique
  res.status(501).json({ error: 'not_implemented', route: 'GET /notifications/:userId' })
})

notificationsRoutes.put('/:userId/preferences', (_req, res) => {
  // preferences par canal
  res.status(501).json({ error: 'not_implemented', route: 'PUT /notifications/:userId/preferences' })
})

