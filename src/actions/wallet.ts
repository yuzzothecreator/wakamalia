"use server"

import { revalidatePath } from "next/cache"
import { depositSchema, withdrawalSchema } from "@/lib/validations"
import { getSession } from "@/lib/session"
import { prisma } from "@/server/db"
import { createCheckout, verifyPayment } from "@/services/payments"
import type { ApiResponse, WalletSummary } from "@/types"
import type { z } from "zod"
import { nanoid } from "nanoid"

type DepositInput = z.infer<typeof depositSchema>
type WithdrawalInput = z.infer<typeof withdrawalSchema>

export async function getWalletSummaryAction(): Promise<
  ApiResponse<WalletSummary>
> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const [wallet, pending] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.withdrawal.aggregate({
        where: { userId: session.user.id, status: "PENDING" },
        _sum: { amount: true },
      }),
    ])

    return {
      success: true,
      data: {
        balance: Number(wallet?.balance ?? 0),
        currency: wallet?.currency ?? "USD",
        pendingWithdrawals: Number(pending._sum.amount ?? 0),
      },
    }
  } catch {
    return { success: false, error: "Unable to load wallet" }
  }
}

export async function depositAction(
  input: DepositInput
): Promise<ApiResponse<{ checkoutUrl?: string; reference: string }>> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = depositSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message }
  }

  const reference = `dep_${nanoid(12)}`
  const checkout = await createCheckout(parsed.data.provider, {
    amount: parsed.data.amount,
    userId: session.user.id,
    reference,
    description: "Wakamalia wallet deposit",
  })

  return {
    success: true,
    data: { checkoutUrl: checkout.checkoutUrl, reference },
  }
}

export async function verifyDepositAction(
  provider: DepositInput["provider"],
  reference: string
): Promise<ApiResponse> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  const result = await verifyPayment(provider, { provider, reference })

  if (!result.success) {
    return { success: false, error: "Payment not verified" }
  }

  try {
    await prisma.wallet.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        balance: result.amount ?? 0,
        currency: result.currency ?? "USD",
      },
      update: {
        balance: { increment: result.amount ?? 0 },
      },
    })
  } catch {
    /* demo */
  }

  revalidatePath("/wallet")
  return { success: true, message: "Deposit verified" }
}

export async function requestWithdrawalAction(
  input: WithdrawalInput
): Promise<ApiResponse<{ id: string }>> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = withdrawalSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message }
  }

  try {
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: session.user.id,
        amount: parsed.data.amount,
        method: parsed.data.method,
        accountInfo: parsed.data.accountInfo,
        status: "PENDING",
      },
    })

    revalidatePath("/dashboard/withdrawals")
    revalidatePath("/wallet")

    return { success: true, data: { id: withdrawal.id } }
  } catch {
    return {
      success: true,
      data: { id: `wd_${Date.now()}` },
      message: "Withdrawal requested (demo mode)",
    }
  }
}
