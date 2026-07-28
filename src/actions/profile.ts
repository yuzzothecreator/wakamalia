"use server"

import { revalidatePath } from "next/cache"
import { profileSchema } from "@/lib/validations"
import { getSession } from "@/lib/session"
import { prisma } from "@/server/db"
import type { ApiResponse } from "@/types"
import type { z } from "zod"

type ProfileInput = z.infer<typeof profileSchema>

export async function updateProfileAction(
  input: ProfileInput
): Promise<ApiResponse> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message }
  }

  try {
    const existing = await prisma.profile.findFirst({
      where: {
        username: parsed.data.username,
        NOT: { userId: session.user.id },
      },
    })
    if (existing) {
      return { success: false, error: "Username is already taken" }
    }

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        username: parsed.data.username,
        bio: parsed.data.bio,
        country: parsed.data.country,
        website: parsed.data.website || null,
        twitter: parsed.data.twitter,
        instagram: parsed.data.instagram,
        telegram: parsed.data.telegram,
      },
      update: {
        username: parsed.data.username,
        bio: parsed.data.bio,
        country: parsed.data.country,
        website: parsed.data.website || null,
        twitter: parsed.data.twitter,
        instagram: parsed.data.instagram,
        telegram: parsed.data.telegram,
      },
    })

    revalidatePath("/settings")
    revalidatePath(`/tipsters/${parsed.data.username}`)
    return { success: true, message: "Profile updated" }
  } catch (error) {
    console.error("[updateProfileAction]", error)
    return { success: false, error: "Failed to update profile" }
  }
}
