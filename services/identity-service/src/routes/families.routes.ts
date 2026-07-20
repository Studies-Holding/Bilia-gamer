import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/identity-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const familiesRoutes: ExpressRouter = Router()

familiesRoutes.get('/:id', (_req, res) => {
  // famille + profils
  res.status(501).json({ error: 'not_implemented', route: 'GET /families/:id' })
})

familiesRoutes.post('/:id/profiles', (_req, res) => {
  // ajout profil (max 7)
  res.status(501).json({ error: 'not_implemented', route: 'POST /families/:id/profiles' })
})

familiesRoutes.put('/:id/parental-control', (_req, res) => {
  // plafonds/validation achats
  res.status(501).json({ error: 'not_implemented', route: 'PUT /families/:id/parental-control' })
})

