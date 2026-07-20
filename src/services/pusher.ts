import Pusher from "pusher"
import PusherClient from "pusher-js"

let pusherServer: Pusher | null = null

export function getPusherServer(): Pusher | null {
  if (pusherServer) return pusherServer

  const appId = process.env.PUSHER_APP_ID
  const key = process.env.PUSHER_KEY
  const secret = process.env.PUSHER_SECRET
  const cluster = process.env.PUSHER_CLUSTER

  if (!appId || !key || !secret || !cluster) {
    return null
  }

  pusherServer = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  })

  return pusherServer
}

export function createPusherClient(): PusherClient | null {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

  if (!key || !cluster) return null

  return new PusherClient(key, { cluster })
}

export async function triggerEvent(
  channel: string,
  event: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const pusher = getPusherServer()
  if (!pusher) {
    console.info("[pusher] stub trigger", { channel, event, data })
    return false
  }

  await pusher.trigger(channel, event, data)
  return true
}

export const CHANNELS = {
  user: (userId: string) => `private-user-${userId}`,
  prediction: (id: string) => `prediction-${id}`,
  admin: () => "private-admin",
} as const

export const EVENTS = {
  notification: "notification",
  message: "new-message",
  predictionUpdate: "prediction-update",
  payment: "payment-completed",
} as const
