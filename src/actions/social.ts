"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { prisma } from "@/server/db"
import type { ApiResponse } from "@/types"

export async function toggleFollowAction(
  tipsterUserId: string
): Promise<ApiResponse<{ following: boolean }>> {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Please log in to follow tipsters" }
  }

  if (tipsterUserId === session.user.id) {
    return { success: false, error: "You cannot follow yourself" }
  }

  try {
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: tipsterUserId,
        },
      },
    })

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } })
      await prisma.tipster.updateMany({
        where: { userId: tipsterUserId },
        data: { followerCount: { decrement: 1 } },
      })
      revalidatePath("/tipsters")
      return { success: true, data: { following: false }, message: "Unfollowed" }
    }

    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: tipsterUserId,
      },
    })
    await prisma.tipster.updateMany({
      where: { userId: tipsterUserId },
      data: { followerCount: { increment: 1 } },
    })

    try {
      await prisma.notification.create({
        data: {
          userId: tipsterUserId,
          actorId: session.user.id,
          type: "FOLLOW",
          title: "New follower",
          body: `${session.user.name ?? "Someone"} started following you`,
          link: `/tipsters`,
        },
      })
    } catch {
      /* optional */
    }

    revalidatePath("/tipsters")
    return { success: true, data: { following: true }, message: "Following" }
  } catch (error) {
    console.error("[toggleFollowAction]", error)
    return { success: false, error: "Could not update follow" }
  }
}
