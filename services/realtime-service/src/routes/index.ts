import { Router, type Router as ExpressRouter } from 'express'
import { presenceRoutes } from './presence.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'realtime-service' })
})

routes.use('/presence', presenceRoutes)
