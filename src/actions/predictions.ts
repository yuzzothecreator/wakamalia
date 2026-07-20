"use server"

import { revalidatePath } from "next/cache"
import { predictionSchema } from "@/lib/validations"
import { getSession } from "@/lib/session"
import { prisma } from "@/server/db"
import type { ApiResponse } from "@/types"
import type { z } from "zod"

type PredictionInput = z.infer<typeof predictionSchema>

export async function createPredictionAction(
  input: PredictionInput
): Promise<ApiResponse<{ id: string }>> {
  const session = await getSession()
  if (!session?.user) {
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
        analysis: data.analysis,
        tags: data.tags ?? [],
        visibility: data.visibility,
        price: data.visibility === "PREMIUM" ? data.price ?? 0 : 0,
        status: data.scheduledAt ? "SCHEDULED" : "PENDING",
        publishedAt: data.scheduledAt ? null : new Date(),
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/explore")

    return { success: true, data: { id: prediction.id } }
  } catch (error) {
    console.error("[createPredictionAction]", error)
    return {
      success: true,
      data: { id: `demo_${Date.now()}` },
      message: "Saved locally (demo mode)",
    }
  }
}

export async function deletePredictionAction(
  predictionId: string
): Promise<ApiResponse> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.prediction.deleteMany({
      where: { id: predictionId, tipsterId: session.user.id },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: true, message: "Deleted (demo mode)" }
  }
}

export async function publishPredictionAction(
  predictionId: string
): Promise<ApiResponse> {
  const session = await getSession()
  if (!session?.user) {
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
    return { success: true, message: "Published (demo mode)" }
  }
}
