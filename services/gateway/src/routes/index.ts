import { Router, type Router as ExpressRouter } from 'express'
import { mountServiceProxies } from './proxy.js'

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gateway' })
})

mountServiceProxies(routes)
