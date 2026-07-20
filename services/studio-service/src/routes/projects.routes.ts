import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/studio-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const projectsRoutes: ExpressRouter = Router()

projectsRoutes.post('/', (_req, res) => {
  // creation projet
  res.status(501).json({ error: 'not_implemented', route: 'POST /projects' })
})

projectsRoutes.put('/:id', (_req, res) => {
  // edition
  res.status(501).json({ error: 'not_implemented', route: 'PUT /projects/:id' })
})

projectsRoutes.post('/:id/build', (_req, res) => {
  // compilation no-code/low-code
  res.status(501).json({ error: 'not_implemented', route: 'POST /projects/:id/build' })
})

projectsRoutes.post('/:id/sandbox', (_req, res) => {
  // execution isolee
  res.status(501).json({ error: 'not_implemented', route: 'POST /projects/:id/sandbox' })
})

projectsRoutes.post('/:id/test', (_req, res) => {
  // tests automatiques
  res.status(501).json({ error: 'not_implemented', route: 'POST /projects/:id/test' })
})

projectsRoutes.post('/:id/versions', (_req, res) => {
  // nouvelle version
  res.status(501).json({ error: 'not_implemented', route: 'POST /projects/:id/versions' })
})

projectsRoutes.post('/:id/publish', (_req, res) => {
  // publication (vers publishing)
  res.status(501).json({ error: 'not_implemented', route: 'POST /projects/:id/publish' })
})

