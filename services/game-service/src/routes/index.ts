import { Router, type Router as ExpressRouter } from 'express'
import { sessionsRoutes } from './sessions.routes.js'
import { roomsRoutes } from './rooms.routes.js'
import { matchmakingRoutes } from './matchmaking.routes.js'
import { savesRoutes } from './saves.routes.js'
import { leaderboardsRoutes } from './leaderboards.routes.js'
import { achievementsRoutes } from './achievements.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'game-service' })
})

routes.use('/sessions', sessionsRoutes)
routes.use('/rooms', roomsRoutes)
routes.use('/matchmaking', matchmakingRoutes)
routes.use('/saves', savesRoutes)
routes.use('/leaderboards', leaderboardsRoutes)
routes.use('/achievements', achievementsRoutes)
