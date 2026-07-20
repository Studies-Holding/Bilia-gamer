import { Router, type Router as ExpressRouter } from 'express'
import { gamesRoutes } from './games.routes.js'
import { categoriesRoutes } from './categories.routes.js'
import { collectionsRoutes } from './collections.routes.js'
import { searchRoutes } from './search.routes.js'
import { access_grantsRoutes } from './access-grants.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'catalog-service' })
})

routes.use('/games', gamesRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/collections', collectionsRoutes)
routes.use('/search', searchRoutes)
routes.use('/access-grants', access_grantsRoutes)
