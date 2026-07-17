import type { BiliaSdkClient } from '../client.js'

export interface SdkNotification {
  id: string
  type: string
  read: boolean
}

/** Notifications in-app (cf. notification-service, Lot 6). */
export class NotificationsModule {
  constructor(private readonly client: BiliaSdkClient) {}

  list(userId: string): Promise<SdkNotification[]> {
    return this.client.request<SdkNotification[]>(`/v1/notifications/${userId}`)
  }

  markRead(notificationId: string): Promise<void> {
    return this.client.request<void>(`/v1/notifications/${notificationId}/read`, { method: 'PUT' })
  }
}
