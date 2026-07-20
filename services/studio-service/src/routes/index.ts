import { Router, type Router as ExpressRouter } from 'express'
import { projectsRoutes } from './projects.routes.js'
import { componentsRoutes } from './components.routes.js'
import { templatesRoutes } from './templates.routes.js'
import { assetsRoutes } from './assets.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'studio-service' })
})

routes.use('/projects', projectsRoutes)
routes.use('/components', componentsRoutes)
routes.use('/templates', templatesRoutes)
routes.use('/assets', assetsRoutes)
