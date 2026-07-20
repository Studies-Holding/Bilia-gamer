import { Router, type Router as ExpressRouter } from 'express'
import { localesRoutes } from './locales.routes.js'
import { translationsRoutes } from './translations.routes.js'
import { translation_jobsRoutes } from './translation-jobs.routes.js'
// __RESOURCE_ROUTES__

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'i18n-service' })
})

routes.use('/locales', localesRoutes)
routes.use('/translations', translationsRoutes)
routes.use('/translation-jobs', translation_jobsRoutes)
