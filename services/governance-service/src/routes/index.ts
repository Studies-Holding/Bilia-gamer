import { Router, type Router as ExpressRouter } from 'express'
import { reportsRoutes } from './reports.routes.js'
import { moderationRoutes } from './moderation.routes.js'
import { certificationsRoutes } from './certifications.routes.js'
import { labelsRoutes } from './labels.routes.js'
import { badgesRoutes } from './badges.routes.js'
import { ip_claimsRoutes } from './ip-claims.routes.js'
import { reputationRoutes } from './reputation.routes.js'
import { validationsRoutes } from './validations.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'governance-service' })
})

routes.use('/reports', reportsRoutes)
routes.use('/moderation', moderationRoutes)
routes.use('/certifications', certificationsRoutes)
routes.use('/labels', labelsRoutes)
routes.use('/badges', badgesRoutes)
routes.use('/ip-claims', ip_claimsRoutes)
routes.use('/reputation', reputationRoutes)
routes.use('/validations', validationsRoutes)
