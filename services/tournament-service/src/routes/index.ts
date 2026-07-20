import { Router, type Router as ExpressRouter } from 'express'
import { tournamentsRoutes } from './tournaments.routes.js'
import { seasonsRoutes } from './seasons.routes.js'
import { eventsRoutes } from './events.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'tournament-service' })
})

routes.use('/tournaments', tournamentsRoutes)
routes.use('/seasons', seasonsRoutes)
routes.use('/events', eventsRoutes)
