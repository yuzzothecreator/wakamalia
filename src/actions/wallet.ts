"use server"

import { revalidatePath } from "next/cache"
import { depositSchema, withdrawalSchema } from "@/lib/validations"
import { getSession, requireSession } from "@/lib/session"
import { prisma } from "@/server/db"
import { createCheckout, verifyPayment } from "@/services/payments"
import { MIN_WITHDRAWAL_AMOUNT } from "@/config/site"
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
  try {
    await requireSession()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

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
  let session
  try {
    session = await requireSession()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

  if (!reference || reference.length > 64 || !/^[a-zA-Z0-9_-]+$/.test(reference)) {
    return { success: false, error: "Invalid payment reference" }
  }

  const result = await verifyPayment(provider, { provider, reference })

  if (!result.success || result.status !== "COMPLETED") {
    return { success: false, error: "Payment not verified" }
  }

  const amount = Number(result.amount ?? 0)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Payment amount missing — cannot credit wallet" }
  }

  try {
    const wallet = await prisma.wallet.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        balance: amount,
        currency: result.currency ?? "USD",
      },
      update: {
        balance: { increment: amount },
      },
    })

    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "DEPOSIT",
        amount,
        balanceAfter: Number(wallet.balance),
        description: `Deposit via ${provider}`,
        referenceId: reference,
      },
    })
  } catch (error) {
    console.error("[verifyDepositAction]", error)
    return { success: false, error: "Failed to credit wallet" }
  }

  revalidatePath("/wallet")
  return { success: true, message: "Deposit verified" }
}

export async function requestWithdrawalAction(
  input: WithdrawalInput
): Promise<ApiResponse<{ id: string }>> {
  let session
  try {
    session = await requireSession()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = withdrawalSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message }
  }

  const amount = parsed.data.amount
  if (amount < MIN_WITHDRAWAL_AMOUNT) {
    return {
      success: false,
      error: `Minimum withdrawal is $${MIN_WITHDRAWAL_AMOUNT}`,
    }
  }

  try {
    const withdrawal = await prisma.$transaction(async (tx) => {
      const debited = await tx.wallet.updateMany({
        where: { userId: session.user.id, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      })
      if (debited.count !== 1) {
        throw new Error("INSUFFICIENT_FUNDS")
      }

      const wallet = await tx.wallet.findUniqueOrThrow({
        where: { userId: session.user.id },
      })

      const row = await tx.withdrawal.create({
        data: {
          userId: session.user.id,
          amount,
          method: parsed.data.method,
          accountInfo: parsed.data.accountInfo,
          status: "PENDING",
        },
      })

      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "WITHDRAWAL",
          amount: -amount,
          balanceAfter: Number(wallet.balance),
          description: `Withdrawal request (${parsed.data.method})`,
          referenceId: row.id,
        },
      })

      return row
    })

    revalidatePath("/dashboard/withdrawals")
    revalidatePath("/wallet")

    return { success: true, data: { id: withdrawal.id } }
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_FUNDS") {
      return { success: false, error: "Insufficient wallet balance" }
    }
    console.error("[requestWithdrawalAction]", error)
    return { success: false, error: "Withdrawal request failed" }
  }
}
