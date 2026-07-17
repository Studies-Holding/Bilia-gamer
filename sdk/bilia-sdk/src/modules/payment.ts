import type { BiliaSdkClient } from '../client.js'

export interface Order {
  id: string
  status: 'pending' | 'succeeded' | 'failed'
}

/** Vendre/débloquer un jeu, Jetons (BiCoins) (cf. payment-service, Lot 4). */
export class PaymentModule {
  constructor(private readonly client: BiliaSdkClient) {}

  createOrder(gameId: string, method: 'bicoins' | 'mobile-money' | 'card'): Promise<Order> {
    return this.client.request<Order>('/v1/payment/orders', {
      method: 'POST',
      body: JSON.stringify({ gameId, method }),
    })
  }
}
