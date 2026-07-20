import { Router, type Router as ExpressRouter } from 'express'
import { ordersRoutes } from './orders.routes.js'
import { subscriptionsRoutes } from './subscriptions.routes.js'
import { webhooksRoutes } from './webhooks.routes.js'
import { payoutsRoutes } from './payouts.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'payment-service' })
})

routes.use('/orders', ordersRoutes)
routes.use('/subscriptions', subscriptionsRoutes)
routes.use('/webhooks', webhooksRoutes)
routes.use('/payouts', payoutsRoutes)
