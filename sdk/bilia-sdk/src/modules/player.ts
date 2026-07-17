import type { BiliaSdkClient } from '../client.js'

export interface PlayerProfile {
  id: string
  displayName: string
  avatarUrl?: string
  ageRange?: string
  locale: string
  country?: string
}

/** Identité joueur (cf. identity-service, Lot 1). */
export class PlayerModule {
  constructor(private readonly client: BiliaSdkClient) {}

  me(): Promise<PlayerProfile> {
    return this.client.request<PlayerProfile>('/v1/identity/me')
  }
}
