import { Router, type Router as ExpressRouter } from 'express'
import { cultural_cardsRoutes } from './cultural-cards.routes.js'
import { proverbsRoutes } from './proverbs.routes.js'
import { storiesRoutes } from './stories.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'griot-service' })
})

routes.use('/cultural-cards', cultural_cardsRoutes)
routes.use('/proverbs', proverbsRoutes)
routes.use('/stories', storiesRoutes)
