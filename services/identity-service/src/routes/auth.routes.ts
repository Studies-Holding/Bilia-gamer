import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/identity-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const authRoutes: ExpressRouter = Router()

authRoutes.post('/register', (_req, res) => {
  // creation de compte
  res.status(501).json({ error: 'not_implemented', route: 'POST /auth/register' })
})

authRoutes.post('/login', (_req, res) => {
  // access + refresh token
  res.status(501).json({ error: 'not_implemented', route: 'POST /auth/login' })
})

authRoutes.post('/refresh', (_req, res) => {
  // renouvellement du token
  res.status(501).json({ error: 'not_implemented', route: 'POST /auth/refresh' })
})

