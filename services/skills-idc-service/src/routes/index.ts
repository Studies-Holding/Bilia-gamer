import { Router, type Router as ExpressRouter } from 'express'
import { taxonomyRoutes } from './taxonomy.routes.js'
import { idcRoutes } from './idc.routes.js'
import { recommendationsRoutes } from './recommendations.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'skills-idc-service' })
})

routes.use('/taxonomy', taxonomyRoutes)
routes.use('/idc', idcRoutes)
routes.use('/recommendations', recommendationsRoutes)
