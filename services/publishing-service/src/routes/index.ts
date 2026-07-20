import { Router, type Router as ExpressRouter } from 'express'
import { submissionsRoutes } from './submissions.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'publishing-service' })
})

routes.use('/submissions', submissionsRoutes)
