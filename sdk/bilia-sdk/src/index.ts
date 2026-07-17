import { BiliaSdkClient, type BiliaSdkConfig } from './client.js'
import { PlayerModule } from './modules/player.js'
import { SessionModule } from './modules/session.js'
import { SaveModule } from './modules/save.js'
import { PaymentModule } from './modules/payment.js'
import { NotificationsModule } from './modules/notifications.js'

export * from './client.js'
export * from './modules/player.js'
export * from './modules/session.js'
export * from './modules/save.js'
export * from './modules/payment.js'
export * from './modules/notifications.js'

/**
 * Point d'entrée du SDK : `createBiliaSdk({ baseUrl }).session.create(gameId)`.
 * Amorce MVP (Lot 3) : player/session/save/payment/notifications.
 * Les briques moteur optionnelles (Babylon/geckos, AFG-DT-005) et les
 * modules P2/P3 (achievements, leaderboard, griot, idc, equalizer) arrivent
 * avec `game-service`/`realtime-service` — cf. ROADMAP.md de ce package.
 */
export function createBiliaSdk(config: BiliaSdkConfig) {
  const client = new BiliaSdkClient(config)
  return {
    client,
    player: new PlayerModule(client),
    session: new SessionModule(client),
    save: new SaveModule(client),
    payment: new PaymentModule(client),
    notifications: new NotificationsModule(client),
  }
}
