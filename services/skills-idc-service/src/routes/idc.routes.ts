import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/skills-idc-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const idcRoutes: ExpressRouter = Router()

idcRoutes.get('/:profileId', (_req, res) => {
  // profil IDC
  res.status(501).json({ error: 'not_implemented', route: 'GET /idc/:profileId' })
})

idcRoutes.post('/:profileId/declare', (_req, res) => {
  // declaration niveau 1 (createur)
  res.status(501).json({ error: 'not_implemented', route: 'POST /idc/:profileId/declare' })
})

