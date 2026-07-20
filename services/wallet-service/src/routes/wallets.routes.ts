import { Router, type Router as ExpressRouter } from 'express'

/**
 * cf. docs/modules/wallet-service.md §4 (API principales).
 * Stubs 501 — logique metier a implementer selon la roadmap du module (§8 de la fiche).
 */
export const walletsRoutes: ExpressRouter = Router()

walletsRoutes.get('/:profileId', (_req, res) => {
  // solde courant
  res.status(501).json({ error: 'not_implemented', route: 'GET /wallets/:profileId' })
})

walletsRoutes.post('/:profileId/credit', (_req, res) => {
  // credit interne (idempotent, appele par payment/game/tournament)
  res.status(501).json({ error: 'not_implemented', route: 'POST /wallets/:profileId/credit' })
})

walletsRoutes.post('/:profileId/debit', (_req, res) => {
  // debit interne (idempotent, refuse si solde insuffisant)
  res.status(501).json({ error: 'not_implemented', route: 'POST /wallets/:profileId/debit' })
})

walletsRoutes.get('/:profileId/ledger', (_req, res) => {
  // historique des mouvements
  res.status(501).json({ error: 'not_implemented', route: 'GET /wallets/:profileId/ledger' })
})

