export type NotificationChannel = "email" | "sms" | "push" | "in_app"

export interface NotificationPayload {
  userId: string
  title: string
  body: string
  href?: string
  channels?: NotificationChannel[]
  metadata?: Record<string, string>
}

export interface NotificationRecord extends NotificationPayload {
  id: string
  read: boolean
  createdAt: string
}

const inAppStore = new Map<string, NotificationRecord[]>()

export async function sendNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; id: string }> {
  const id = `ntf_${Date.now()}`
  const channels = payload.channels ?? ["in_app"]
  const record: NotificationRecord = {
    ...payload,
    id,
    read: false,
    createdAt: new Date().toISOString(),
    channels,
  }

  for (const channel of channels) {
    switch (channel) {
      case "email":
        console.info("[notifications] email stub", payload)
        break
      case "sms":
        console.info("[notifications] sms stub", payload)
        break
      case "push":
        console.info("[notifications] push stub", payload)
        break
      case "in_app": {
        const existing = inAppStore.get(payload.userId) ?? []
        inAppStore.set(payload.userId, [record, ...existing].slice(0, 50))
        break
      }
    }
  }

  return { success: true, id }
}

export async function getInAppNotifications(
  userId: string
): Promise<NotificationRecord[]> {
  return inAppStore.get(userId) ?? []
}

export async function markNotificationRead(
  userId: string,
  notificationId: string
): Promise<boolean> {
  const list = inAppStore.get(userId) ?? []
  const updated = list.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  )
  inAppStore.set(userId, updated)
  return true
}

export async function sendBulkNotification(
  userIds: string[],
  payload: Omit<NotificationPayload, "userId">
): Promise<{ sent: number }> {
  await Promise.all(
    userIds.map((userId) => sendNotification({ ...payload, userId }))
  )
  return { sent: userIds.length }
}
