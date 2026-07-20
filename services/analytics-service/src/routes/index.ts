import { Router, type Router as ExpressRouter } from 'express'
import { passportRoutes } from './passport.routes.js'
import { dashboardsRoutes } from './dashboards.routes.js'
import { statsRoutes } from './stats.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'analytics-service' })
})

routes.use('/passport', passportRoutes)
routes.use('/dashboards', dashboardsRoutes)
routes.use('/stats', statsRoutes)
