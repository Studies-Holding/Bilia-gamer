import type { BiliaSdkClient } from '../client.js'

export interface GameSession {
  id: string
  gameId: string
  status: 'lobby' | 'active' | 'ended'
}

/** Parties : create/join/leave/resume (cf. game-service, Lot 3). */
export class SessionModule {
  constructor(private readonly client: BiliaSdkClient) {}

  create(gameId: string): Promise<GameSession> {
    return this.client.request<GameSession>('/v1/game/sessions', {
      method: 'POST',
      body: JSON.stringify({ gameId }),
    })
  }

  join(sessionId: string): Promise<GameSession> {
    return this.client.request<GameSession>(`/v1/game/sessions/${sessionId}/join`, { method: 'POST' })
  }

  leave(sessionId: string): Promise<void> {
    return this.client.request<void>(`/v1/game/sessions/${sessionId}/leave`, { method: 'POST' })
  }

  resume(sessionId: string): Promise<GameSession> {
    return this.client.request<GameSession>(`/v1/game/sessions/${sessionId}/resume`, { method: 'POST' })
  }
}
