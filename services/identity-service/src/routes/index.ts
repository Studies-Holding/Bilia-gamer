import { Router, type Router as ExpressRouter } from 'express'
import { authRoutes } from './auth.routes.js'
import { familiesRoutes } from './families.routes.js'
import { profilesRoutes } from './profiles.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'identity-service' })
})

routes.use('/auth', authRoutes)
routes.use('/families', familiesRoutes)
routes.use('/profiles', profilesRoutes)
