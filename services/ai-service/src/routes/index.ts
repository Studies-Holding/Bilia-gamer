import { Router, type Router as ExpressRouter } from 'express'
import { assistRoutes } from './assist.routes.js'
import { translateRoutes } from './translate.routes.js'
import { moderateRoutes } from './moderate.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-service' })
})

routes.use('/assist', assistRoutes)
routes.use('/translate', translateRoutes)
routes.use('/moderate', moderateRoutes)
