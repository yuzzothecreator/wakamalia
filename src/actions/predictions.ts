"use server"

import { revalidatePath } from "next/cache"
import {
  predictionSchema,
  quickPredictionSchema,
} from "@/lib/validations"
import { requireTipster } from "@/lib/session"
import { prisma } from "@/server/db"
import { savePredictionScreenshot } from "@/server/uploads"
import type { ApiResponse } from "@/types"
import type { z } from "zod"

type PredictionInput = z.infer<typeof predictionSchema>

export async function createPredictionAction(
  input: PredictionInput
): Promise<ApiResponse<{ id: string }>> {
  let session
  try {
    session = await requireTipster()
  } catch (error) {
    if (error instanceof Error && error.message === "Account banned") {
      return { success: false, error: "Account banned" }
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return { success: false, error: "Only tipsters can publish predictions" }
    }
    return { success: false, error: "Unauthorized" }
  }

  const parsed = predictionSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message }
  }

  try {
    const data = parsed.data
    const prediction = await prisma.prediction.create({
      data: {
        tipsterId: session.user.id,
        title: data.title,
        sport: data.sport,
        league: data.league,
        tournament: data.tournament,
        match: data.match,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        kickoffTime: new Date(data.kickoffTime),
        prediction: data.prediction,
        odds: data.odds,
        confidence: data.confidence,
        bookmaker: data.bookmaker,
        bookingCode: data.bookingCode,
        analysis: data.analysis,
        tags: data.tags ?? [],
        visibility: data.visibility,
        price: data.visibility === "PREMIUM" ? data.price ?? 0 : 0,
        status: data.scheduledAt ? "SCHEDULED" : "PENDING",
        publishedAt: data.scheduledAt ? null : new Date(),
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
    })

    await prisma.tipster.updateMany({
      where: { userId: session.user.id },
      data: { totalPredictions: { increment: 1 } },
    })

    revalidatePath("/dashboard")
    revalidatePath("/explore")

    return { success: true, data: { id: prediction.id } }
  } catch (error) {
    console.error("[createPredictionAction]", error)
    return {
      success: false,
      error: "Failed to create prediction. Check your database connection.",
    }
  }
}

export async function createQuickPredictionAction(
  formData: FormData
): Promise<ApiResponse<{ id: string }>> {
  let session
  try {
    session = await requireTipster()
  } catch (error) {
    if (error instanceof Error && error.message === "Account banned") {
      return { success: false, error: "Account banned" }
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return { success: false, error: "Only tipsters can publish predictions" }
    }
    return { success: false, error: "Unauthorized" }
  }

  const parsed = quickPredictionSchema.safeParse({
    bookingCode: formData.get("bookingCode"),
    sport: formData.get("sport") || "FOOTBALL",
    visibility: formData.get("visibility") || "FREE",
    price: formData.get("price") || undefined,
    note: formData.get("note") || undefined,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const screenshot = formData.get("screenshot")
  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return { success: false, error: "Add a bet slip screenshot" }
  }

  const uploaded = await savePredictionScreenshot(screenshot)
  if ("error" in uploaded) {
    return { success: false, error: uploaded.error }
  }

  const data = parsed.data
  const code = data.bookingCode.trim().toUpperCase()
  const title = `Booking code ${code}`

  try {
    const prediction = await prisma.prediction.create({
      data: {
        tipsterId: session.user.id,
        title,
        sport: data.sport,
        match: `Booking code ${code}`,
        homeTeam: "See slip",
        awayTeam: "See slip",
        kickoffTime: new Date(Date.now() + 36e5 * 24),
        prediction: code,
        odds: 1.01,
        confidence: 5,
        bookingCode: code,
        analysis: data.note?.trim() || null,
        tags: ["quick-post", "booking-code"],
        visibility: data.visibility,
        price: data.visibility === "PREMIUM" ? data.price ?? 0 : 0,
        status: "PENDING",
        publishedAt: new Date(),
        images: {
          create: {
            url: uploaded.url,
            publicId: uploaded.publicId,
            alt: `Bet slip screenshot for ${code}`,
          },
        },
      },
    })

    await prisma.tipster.updateMany({
      where: { userId: session.user.id },
      data: { totalPredictions: { increment: 1 } },
    })

    revalidatePath("/dashboard")
    revalidatePath("/explore")
    revalidatePath(`/predictions/${prediction.id}`)

    return { success: true, data: { id: prediction.id }, message: "Quick pick published" }
  } catch (error) {
    console.error("[createQuickPredictionAction]", error)
    return {
      success: false,
      error: "Failed to publish. Check your database connection.",
    }
  }
}

export async function deletePredictionAction(
  predictionId: string
): Promise<ApiResponse> {
  let session
  try {
    session = await requireTipster()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.prediction.deleteMany({
      where: { id: predictionId, tipsterId: session.user.id },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete prediction" }
  }
}

export async function publishPredictionAction(
  predictionId: string
): Promise<ApiResponse> {
  let session
  try {
    session = await requireTipster()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.prediction.updateMany({
      where: { id: predictionId, tipsterId: session.user.id },
      data: { status: "PENDING", publishedAt: new Date() },
    })
    revalidatePath("/dashboard")
    revalidatePath("/explore")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to publish prediction" }
  }
}
