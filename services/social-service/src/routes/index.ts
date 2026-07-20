import { Router, type Router as ExpressRouter } from 'express'
import { friendshipsRoutes } from './friendships.routes.js'
import { communitiesRoutes } from './communities.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'social-service' })
})

routes.use('/friendships', friendshipsRoutes)
routes.use('/communities', communitiesRoutes)
