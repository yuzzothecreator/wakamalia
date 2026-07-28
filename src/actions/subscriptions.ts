"use server"

import { revalidatePath } from "next/cache"
import { requireSession } from "@/lib/session"
import { prisma } from "@/server/db"
import { PLATFORM_COMMISSION_RATE } from "@/config/site"
import type { ApiResponse } from "@/types"

function addInterval(start: Date, interval: "WEEKLY" | "MONTHLY") {
  const ends = new Date(start)
  if (interval === "WEEKLY") ends.setDate(ends.getDate() + 7)
  else ends.setMonth(ends.getMonth() + 1)
  return ends
}

async function ensureWallet(userId: string) {
  return prisma.wallet.upsert({
    where: { userId },
    create: { userId, balance: 0, currency: "USD" },
    update: {},
  })
}

export async function subscribeToTipsterAction(input: {
  tipsterId: string
  interval: "WEEKLY" | "MONTHLY"
}): Promise<ApiResponse<{ subscriptionId: string }>> {
  let session
  try {
    session = await requireSession()
  } catch (error) {
    if (error instanceof Error && error.message === "Account banned") {
      return { success: false, error: "Account banned" }
    }
    return { success: false, error: "Please log in to subscribe" }
  }

  if (input.tipsterId === session.user.id) {
    return { success: false, error: "You cannot subscribe to yourself" }
  }

  try {
    const tipster = await prisma.tipster.findUnique({
      where: { userId: input.tipsterId },
      include: { user: { include: { profile: true } } },
    })
    if (!tipster) {
      return { success: false, error: "Tipster not found" }
    }

    const active = await prisma.subscription.findFirst({
      where: {
        subscriberId: session.user.id,
        tipsterId: input.tipsterId,
        status: "ACTIVE",
        endsAt: { gt: new Date() },
      },
    })
    if (active) {
      return { success: false, error: "You already have an active subscription" }
    }

    const amount =
      input.interval === "WEEKLY"
        ? Number(tipster.weeklyPrice)
        : Number(tipster.monthlyPrice)

    if (amount <= 0) {
      return { success: false, error: "This tipster has not set a subscription price" }
    }

    const wallet = await ensureWallet(session.user.id)
    const balance = Number(wallet.balance)
    if (balance < amount) {
      return {
        success: false,
        error: `Insufficient wallet balance. Need $${amount.toFixed(2)} — top up your wallet first.`,
      }
    }

    const commission = Number((amount * PLATFORM_COMMISSION_RATE).toFixed(2))
    const tipsterEarn = Number((amount - commission).toFixed(2))
    const startsAt = new Date()
    const endsAt = addInterval(startsAt, input.interval)

    const subscription = await prisma.$transaction(async (tx) => {
      const debited = await tx.wallet.updateMany({
        where: { userId: session.user.id, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      })
      if (debited.count !== 1) {
        throw new Error("INSUFFICIENT_FUNDS")
      }

      const updated = await tx.wallet.findUniqueOrThrow({
        where: { userId: session.user.id },
      })

      const tipsterWallet = await tx.wallet.upsert({
        where: { userId: input.tipsterId },
        create: {
          userId: input.tipsterId,
          balance: tipsterEarn,
          currency: "USD",
        },
        update: { balance: { increment: tipsterEarn } },
      })

      const sub = await tx.subscription.create({
        data: {
          subscriberId: session.user.id,
          tipsterId: input.tipsterId,
          interval: input.interval,
          status: "ACTIVE",
          price: amount,
          currency: "USD",
          startsAt,
          endsAt,
        },
      })

      await tx.payment.create({
        data: {
          userId: session.user.id,
          amount,
          currency: "USD",
          provider: "WALLET",
          status: "COMPLETED",
          type: "SUBSCRIPTION",
          metadata: {
            tipsterId: input.tipsterId,
            interval: input.interval,
            subscriptionId: sub.id,
            commission,
          },
        },
      })

      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "SUBSCRIPTION",
          amount: -amount,
          balanceAfter: Number(updated.balance),
          description: `Subscription to @${tipster.user.profile?.username ?? "tipster"} (${input.interval.toLowerCase()})`,
          referenceId: sub.id,
        },
      })

      await tx.transaction.create({
        data: {
          userId: input.tipsterId,
          type: "EARNING",
          amount: tipsterEarn,
          balanceAfter: Number(tipsterWallet.balance),
          description: `Subscription payout (${input.interval.toLowerCase()})`,
          referenceId: sub.id,
        },
      })

      await tx.tipster.update({
        where: { userId: input.tipsterId },
        data: {
          subscriberCount: { increment: 1 },
          totalEarnings: { increment: tipsterEarn },
          monthlyProfit: { increment: tipsterEarn },
        },
      })

      return sub
    })

    try {
      await prisma.notification.create({
        data: {
          userId: input.tipsterId,
          actorId: session.user.id,
          type: "SUBSCRIPTION",
          title: "New subscriber",
          body: `${session.user.name ?? "Someone"} subscribed ${input.interval.toLowerCase()}`,
          link: "/dashboard/subscribers",
        },
      })
    } catch {
      /* optional */
    }

    const username = tipster.user.profile?.username
    revalidatePath("/wallet")
    revalidatePath("/dashboard")
    if (username) revalidatePath(`/tipsters/${username}`)

    return {
      success: true,
      data: { subscriptionId: subscription.id },
      message: `Subscribed until ${endsAt.toLocaleDateString()}`,
    }
  } catch (error) {
    console.error("[subscribeToTipsterAction]", error)
    if (error instanceof Error && error.message === "INSUFFICIENT_FUNDS") {
      return {
        success: false,
        error: "Insufficient wallet balance — top up your wallet first.",
      }
    }
    return { success: false, error: "Subscription failed. Try again." }
  }
}

export async function cancelSubscriptionAction(
  subscriptionId: string
): Promise<ApiResponse> {
  let session
  try {
    session = await requireSession()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const updated = await prisma.subscription.updateMany({
      where: { id: subscriptionId, subscriberId: session.user.id, status: "ACTIVE" },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    })
    if (!updated.count) {
      return { success: false, error: "Subscription not found" }
    }
    revalidatePath("/settings")
    return { success: true, message: "Subscription cancelled" }
  } catch {
    return { success: false, error: "Could not cancel subscription" }
  }
}

export async function unlockPredictionAction(
  predictionId: string
): Promise<ApiResponse<{ unlocked: boolean }>> {
  let session
  try {
    session = await requireSession()
  } catch (error) {
    if (error instanceof Error && error.message === "Account banned") {
      return { success: false, error: "Account banned" }
    }
    return { success: false, error: "Please log in to unlock" }
  }

  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id: predictionId },
      include: {
        tipster: { include: { profile: true, tipster: true } },
      },
    })
    if (!prediction) {
      return { success: false, error: "Prediction not found" }
    }

    if (prediction.visibility === "FREE") {
      return { success: true, data: { unlocked: true } }
    }

    if (prediction.tipsterId === session.user.id) {
      return { success: true, data: { unlocked: true } }
    }

    const existingPurchase = await prisma.predictionPurchase.findUnique({
      where: {
        userId_predictionId: {
          userId: session.user.id,
          predictionId,
        },
      },
    })
    if (existingPurchase) {
      return { success: true, data: { unlocked: true } }
    }

    const activeSub = await prisma.subscription.findFirst({
      where: {
        subscriberId: session.user.id,
        tipsterId: prediction.tipsterId,
        status: "ACTIVE",
        endsAt: { gt: new Date() },
      },
    })
    if (activeSub) {
      return {
        success: true,
        data: { unlocked: true },
        message: "Unlocked via your subscription",
      }
    }

    const amount = Number(prediction.price)
    if (amount <= 0) {
      return { success: false, error: "Invalid price on this prediction" }
    }

    const wallet = await ensureWallet(session.user.id)
    if (Number(wallet.balance) < amount) {
      return {
        success: false,
        error: `Insufficient wallet balance. Need $${amount.toFixed(2)} — top up first.`,
      }
    }

    const commission = Number((amount * PLATFORM_COMMISSION_RATE).toFixed(2))
    const tipsterEarn = Number((amount - commission).toFixed(2))

    await prisma.$transaction(async (tx) => {
      const debited = await tx.wallet.updateMany({
        where: { userId: session.user.id, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      })
      if (debited.count !== 1) {
        throw new Error("INSUFFICIENT_FUNDS")
      }

      const updated = await tx.wallet.findUniqueOrThrow({
        where: { userId: session.user.id },
      })

      await tx.wallet.upsert({
        where: { userId: prediction.tipsterId },
        create: {
          userId: prediction.tipsterId,
          balance: tipsterEarn,
          currency: "USD",
        },
        update: { balance: { increment: tipsterEarn } },
      })

      const tipsterWallet = await tx.wallet.findUniqueOrThrow({
        where: { userId: prediction.tipsterId },
      })

      await tx.predictionPurchase.create({
        data: {
          userId: session.user.id,
          predictionId,
          amount,
        },
      })

      await tx.payment.create({
        data: {
          userId: session.user.id,
          amount,
          currency: "USD",
          provider: "WALLET",
          status: "COMPLETED",
          type: "PREMIUM_SLIP",
          metadata: {
            predictionId,
            tipsterId: prediction.tipsterId,
            commission,
          },
        },
      })

      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "UNLOCK",
          amount: -amount,
          balanceAfter: Number(updated.balance),
          description: `Unlocked: ${prediction.title}`,
          referenceId: predictionId,
        },
      })

      await tx.transaction.create({
        data: {
          userId: prediction.tipsterId,
          type: "EARNING",
          amount: tipsterEarn,
          balanceAfter: Number(tipsterWallet.balance),
          description: `Premium unlock sale`,
          referenceId: predictionId,
        },
      })

      await tx.tipster.updateMany({
        where: { userId: prediction.tipsterId },
        data: {
          totalEarnings: { increment: tipsterEarn },
          monthlyProfit: { increment: tipsterEarn },
        },
      })
    })

    try {
      await prisma.notification.create({
        data: {
          userId: prediction.tipsterId,
          actorId: session.user.id,
          type: "PURCHASE",
          title: "Premium unlock",
          body: `${session.user.name ?? "Someone"} unlocked your tip`,
          link: `/predictions/${predictionId}`,
        },
      })
    } catch {
      /* optional */
    }

    revalidatePath(`/predictions/${predictionId}`)
    revalidatePath("/wallet")
    revalidatePath("/explore")
    const username = prediction.tipster.profile?.username
    if (username) revalidatePath(`/tipsters/${username}`)

    return {
      success: true,
      data: { unlocked: true },
      message: "Prediction unlocked",
    }
  } catch (error) {
    console.error("[unlockPredictionAction]", error)
    if (error instanceof Error && error.message === "INSUFFICIENT_FUNDS") {
      return {
        success: false,
        error: "Insufficient wallet balance — top up first.",
      }
    }
    return { success: false, error: "Unlock failed. Try again." }
  }
}
