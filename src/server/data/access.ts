import { prisma } from "@/server/db"

/** Whether a viewer can see premium tip content */
export async function canAccessPrediction(
  predictionId: string,
  viewerId?: string | null
): Promise<boolean> {
  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id: predictionId },
      select: {
        visibility: true,
        tipsterId: true,
      },
    })
    if (!prediction) return false
    if (prediction.visibility === "FREE") return true
    if (!viewerId) return false
    if (prediction.tipsterId === viewerId) return true

    const [purchase, subscription] = await Promise.all([
      prisma.predictionPurchase.findUnique({
        where: {
          userId_predictionId: {
            userId: viewerId,
            predictionId,
          },
        },
      }),
      prisma.subscription.findFirst({
        where: {
          subscriberId: viewerId,
          tipsterId: prediction.tipsterId,
          status: "ACTIVE",
          endsAt: { gt: new Date() },
        },
      }),
    ])

    return Boolean(purchase || subscription)
  } catch {
    return false
  }
}

export async function getViewerTipsterState(
  tipsterUserId: string,
  viewerId?: string | null
) {
  if (!viewerId) {
    return { isFollowing: false, isSubscribed: false, isOwner: false }
  }

  if (viewerId === tipsterUserId) {
    return { isFollowing: false, isSubscribed: false, isOwner: true }
  }

  try {
    const [follow, subscription] = await Promise.all([
      prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: viewerId,
            followingId: tipsterUserId,
          },
        },
      }),
      prisma.subscription.findFirst({
        where: {
          subscriberId: viewerId,
          tipsterId: tipsterUserId,
          status: "ACTIVE",
          endsAt: { gt: new Date() },
        },
      }),
    ])

    return {
      isFollowing: Boolean(follow),
      isSubscribed: Boolean(subscription),
      isOwner: false,
    }
  } catch {
    return { isFollowing: false, isSubscribed: false, isOwner: false }
  }
}

export async function markPredictionsAccess<
  T extends { id: string; visibility: string; tipster: { id: string }; isUnlocked?: boolean },
>(predictions: T[], viewerId?: string | null): Promise<T[]> {
  if (!predictions.length) return predictions

  return Promise.all(
    predictions.map(async (prediction) => {
      if (prediction.visibility !== "PREMIUM") {
        return { ...prediction, isUnlocked: true }
      }
      if (!viewerId) {
        return { ...prediction, isUnlocked: false }
      }
      if (prediction.tipster.id === viewerId) {
        return { ...prediction, isUnlocked: true }
      }
      const unlocked = await canAccessPrediction(prediction.id, viewerId)
      return { ...prediction, isUnlocked: unlocked }
    })
  )
}
