import { Router, type Router as ExpressRouter } from 'express'
import { walletsRoutes } from './wallets.routes.js'
import { giftcardsRoutes } from './giftcards.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'wallet-service' })
})

routes.use('/wallets', walletsRoutes)
routes.use('/giftcards', giftcardsRoutes)
