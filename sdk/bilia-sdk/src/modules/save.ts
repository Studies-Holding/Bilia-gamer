import type { BiliaSdkClient } from '../client.js'

/** Sauvegardes, reprise multi-appareil (cf. game-service, Lot 3). */
export class SaveModule {
  constructor(private readonly client: BiliaSdkClient) {}

  load<TState>(profileId: string, gameId: string): Promise<TState | null> {
    return this.client.request<TState | null>(`/v1/game/saves/${profileId}/${gameId}`)
  }

  put<TState>(sessionId: string, state: TState): Promise<void> {
    return this.client.request<void>(`/v1/game/sessions/${sessionId}/save`, {
      method: 'PUT',
      body: JSON.stringify(state),
    })
  }
}
