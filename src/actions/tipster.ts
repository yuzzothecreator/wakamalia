"use server"

import { revalidatePath } from "next/cache"
import { becomeTipsterSchema } from "@/lib/validations"
import { requireSession } from "@/lib/session"
import { prisma } from "@/server/db"
import type { ApiResponse } from "@/types"
import type { z } from "zod"

type BecomeTipsterInput = z.infer<typeof becomeTipsterSchema>

export async function becomeTipsterAction(
  input: BecomeTipsterInput
): Promise<ApiResponse<{ role: string }>> {
  let session
  try {
    session = await requireSession()
  } catch (error) {
    if (error instanceof Error && error.message === "Account banned") {
      return { success: false, error: "Account banned" }
    }
    return { success: false, error: "Please log in first" }
  }

  const parsed = becomeTipsterSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const role = (session.user as { role?: string }).role ?? "SUBSCRIBER"
  if (role === "ADMIN") {
    return { success: false, error: "Admins already have tipster access" }
  }

  try {
    const existing = await prisma.tipster.findUnique({
      where: { userId: session.user.id },
    })

    if (existing && role === "TIPSTER") {
      return { success: false, error: "You are already a tipster" }
    }

    const data = parsed.data

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { role: "TIPSTER" },
      })

      await tx.tipster.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          weeklyPrice: data.weeklyPrice,
          monthlyPrice: data.monthlyPrice,
        },
        update: {
          weeklyPrice: data.weeklyPrice,
          monthlyPrice: data.monthlyPrice,
        },
      })

      await tx.wallet.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, balance: 0, currency: "USD" },
        update: {},
      })

      if (data.bio !== undefined || data.country !== undefined) {
        const profile = await tx.profile.findUnique({
          where: { userId: session.user.id },
        })
        if (profile) {
          await tx.profile.update({
            where: { userId: session.user.id },
            data: {
              ...(data.bio !== undefined ? { bio: data.bio } : {}),
              ...(data.country !== undefined ? { country: data.country } : {}),
            },
          })
        }
      }
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/become-tipster")
    revalidatePath("/explore")
    revalidatePath("/settings")

    return {
      success: true,
      data: { role: "TIPSTER" },
      message: "Welcome — you are now a tipster",
    }
  } catch (error) {
    console.error("[becomeTipsterAction]", error)
    return { success: false, error: "Could not activate tipster account" }
  }
}

export async function updateTipsterPricingAction(input: {
  weeklyPrice: number
  monthlyPrice: number
}): Promise<ApiResponse> {
  let session
  try {
    session = await requireSession()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

  const role = (session.user as { role?: string }).role
  if (role !== "TIPSTER" && role !== "ADMIN") {
    return { success: false, error: "Only tipsters can update pricing" }
  }

  try {
    await prisma.tipster.update({
      where: { userId: session.user.id },
      data: {
        weeklyPrice: input.weeklyPrice,
        monthlyPrice: input.monthlyPrice,
      },
    })
    revalidatePath("/dashboard")
    revalidatePath("/settings")
    return { success: true, message: "Pricing updated" }
  } catch (error) {
    console.error("[updateTipsterPricingAction]", error)
    return { success: false, error: "Failed to update pricing" }
  }
}
