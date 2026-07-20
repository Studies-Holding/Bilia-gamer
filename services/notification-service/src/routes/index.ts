import { Router, type Router as ExpressRouter } from 'express'
import { notificationsRoutes } from './notifications.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'notification-service' })
})

routes.use('/notifications', notificationsRoutes)
