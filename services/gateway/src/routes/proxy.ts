import { createProxyMiddleware } from 'http-proxy-middleware'
import type { Router } from 'express'

/**
 * Table de routage vers les services métier (cf. AFG-DT-001 §3 pour la liste
 * des ports). Une entrée par service, activée dès qu'il existe réellement.
 * URL configurable par variable d'env pour permettre staging/prod sans
 * changer le code (ex. IDENTITY_SERVICE_URL).
 */
export interface ProxyTarget {
  prefix: string
  envVar: string
  defaultUrl: string
}

export const PROXY_TARGETS: ProxyTarget[] = [
  // { prefix: '/v1/identity', envVar: 'IDENTITY_SERVICE_URL', defaultUrl: 'http://localhost:5001' }, // Lot 1
  // { prefix: '/v1/catalog', envVar: 'CATALOG_SERVICE_URL', defaultUrl: 'http://localhost:5002' },   // Lot 2
]

/** Monte un proxy HTTP par cible connue. Aucune cible tant qu'aucun service métier n'existe (Lot 0). */
export function mountServiceProxies(router: Router): void {
  for (const target of PROXY_TARGETS) {
    const upstream = process.env[target.envVar] ?? target.defaultUrl
    router.use(target.prefix, createProxyMiddleware({ target: upstream, changeOrigin: true }))
  }
}
