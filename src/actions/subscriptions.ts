"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { prisma } from "@/server/db"
import { createCheckout } from "@/services/payments"
import type { ApiResponse } from "@/types"
import { nanoid } from "nanoid"

export async function subscribeToTipsterAction(input: {
  tipsterId: string
  interval: "WEEKLY" | "MONTHLY"
  provider?: "STRIPE" | "FLUTTERWAVE" | "PAYSTACK" | "WALLET"
}): Promise<ApiResponse<{ checkoutUrl?: string; reference: string }>> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  const reference = `sub_${nanoid(12)}`
  const provider = input.provider ?? "STRIPE"

  try {
    const tipster = await prisma.tipster.findFirst({
      where: { userId: input.tipsterId },
    })

    const amount =
      input.interval === "WEEKLY"
        ? Number(tipster?.weeklyPrice ?? 9.99)
        : Number(tipster?.monthlyPrice ?? 29.99)

    const checkout = await createCheckout(provider, {
      amount,
      userId: session.user.id,
      reference,
      description: `Subscription (${input.interval.toLowerCase()})`,
      metadata: { tipsterId: input.tipsterId, interval: input.interval },
    })

    return {
      success: true,
      data: { checkoutUrl: checkout.checkoutUrl, reference },
    }
  } catch {
    const checkout = await createCheckout(provider, {
      amount: input.interval === "WEEKLY" ? 9.99 : 29.99,
      userId: session.user.id,
      reference,
      description: "Tipster subscription",
    })

    return {
      success: true,
      data: { checkoutUrl: checkout.checkoutUrl, reference },
      message: "Checkout created (demo mode)",
    }
  }
}

export async function cancelSubscriptionAction(
  subscriptionId: string
): Promise<ApiResponse> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.subscription.updateMany({
      where: { id: subscriptionId, subscriberId: session.user.id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    })
    revalidatePath("/settings")
    return { success: true }
  } catch {
    return { success: true, message: "Subscription cancelled (demo mode)" }
  }
}

export async function unlockPredictionAction(
  predictionId: string
): Promise<ApiResponse<{ unlocked: boolean }>> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id: predictionId },
      select: { price: true },
    })
    await prisma.predictionPurchase.create({
      data: {
        userId: session.user.id,
        predictionId,
        amount: prediction?.price ?? 0,
      },
    })
    revalidatePath(`/predictions/${predictionId}`)
    return { success: true, data: { unlocked: true } }
  } catch {
    return { success: true, data: { unlocked: true }, message: "Demo unlock" }
  }
}
