/**
 * Client SDK — config, auth, transport (cf. modules/shared-and-sdk.md §B).
 * Amorce Lot 3 (AFG-DT-003) : les méthodes des modules (player/session/save/
 * payment/notifications) sont des wrappers HTTP typés vers le `gateway`.
 * Tant qu'`identity-service`/`gateway` ne sont pas construits (Lot 1), ces
 * appels échoueront en runtime — c'est attendu : le contrat est posé avant
 * l'implémentation serveur (cf. AFG-DT-003 principe 5, contrats figés tôt).
 */

export interface BiliaSdkConfig {
  /** URL de base du gateway, ex. "https://api.bilibilia.africa" ou "http://localhost:5000" en dev. */
  baseUrl: string
  /** Token d'accès courant (géré par l'app hôte ; le SDK ne stocke pas de secret). */
  getAccessToken?: () => string | null | Promise<string | null>
}

export class BiliaSdkClient {
  readonly config: BiliaSdkConfig

  constructor(config: BiliaSdkConfig) {
    this.config = config
  }

  async request<TResponse>(path: string, init: RequestInit = {}): Promise<TResponse> {
    const token = await this.config.getAccessToken?.()
    const headers = new Headers(init.headers)
    headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const res = await fetch(`${this.config.baseUrl}${path}`, { ...init, headers })
    if (!res.ok) {
      throw new Error(`bilia-sdk: ${init.method ?? 'GET'} ${path} -> ${res.status}`)
    }
    return (await res.json()) as TResponse
  }
}
