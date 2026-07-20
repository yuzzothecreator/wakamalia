import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  roleProcedure,
} from "@/server/trpc/trpc"
import { predictionSchema, searchSchema, profileSchema } from "@/lib/validations"
import { DEMO_PREDICTIONS, DEMO_TIPSTERS, DEMO_LEADERBOARD } from "@/lib/demo-data"

export const predictionsRouter = createTRPCRouter({
  list: publicProcedure.input(searchSchema).query(async ({ ctx, input }) => {
    try {
      const where = {
        status: { not: "DRAFT" as const },
        ...(input.sport && input.sport !== "ALL"
          ? { sport: input.sport as never }
          : {}),
        ...(input.visibility && input.visibility !== "ALL"
          ? { visibility: input.visibility }
          : {}),
        ...(input.q
          ? {
              OR: [
                { title: { contains: input.q, mode: "insensitive" as const } },
                { match: { contains: input.q, mode: "insensitive" as const } },
                { league: { contains: input.q, mode: "insensitive" as const } },
              ],
            }
          : {}),
      }

      const [items, total] = await Promise.all([
        ctx.prisma.prediction.findMany({
          where,
          include: {
            tipster: {
              include: { profile: true, tipster: true },
            },
          },
          orderBy: { publishedAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        ctx.prisma.prediction.count({ where }),
      ])

      return {
        items,
        total,
        page: input.page,
        limit: input.limit,
        totalPages: Math.ceil(total / input.limit) || 1,
      }
    } catch {
      // Fallback demo data when DB is unavailable
      return {
        items: DEMO_PREDICTIONS,
        total: DEMO_PREDICTIONS.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      }
    }
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const prediction = await ctx.prisma.prediction.findUnique({
          where: { id: input.id },
          include: {
            tipster: { include: { profile: true, tipster: true } },
            images: true,
            comments: {
              include: { user: { include: { profile: true } } },
              orderBy: { createdAt: "desc" },
              take: 50,
            },
          },
        })
        if (prediction) return prediction
      } catch {
        /* demo fallback */
      }
      return DEMO_PREDICTIONS.find((p) => p.id === input.id) ?? DEMO_PREDICTIONS[0]
    }),

  create: roleProcedure(["TIPSTER", "ADMIN"])
    .input(predictionSchema)
    .mutation(async ({ ctx, input }) => {
      const prediction = await ctx.prisma.prediction.create({
        data: {
          tipsterId: ctx.user.id,
          title: input.title,
          sport: input.sport,
          league: input.league,
          tournament: input.tournament,
          match: input.match,
          homeTeam: input.homeTeam,
          awayTeam: input.awayTeam,
          kickoffTime: new Date(input.kickoffTime),
          prediction: input.prediction,
          odds: input.odds,
          confidence: input.confidence,
          bookmaker: input.bookmaker,
          analysis: input.analysis,
          tags: input.tags ?? [],
          visibility: input.visibility,
          price: input.visibility === "PREMIUM" ? input.price ?? 0 : 0,
          status: input.scheduledAt ? "SCHEDULED" : "PENDING",
          publishedAt: input.scheduledAt ? null : new Date(),
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        },
      })

      await ctx.prisma.tipster.updateMany({
        where: { userId: ctx.user.id },
        data: { totalPredictions: { increment: 1 } },
      })

      return prediction
    }),
})

export const tipstersRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        sort: z
          .enum(["roi", "winRate", "followers", "earnings"])
          .default("roi"),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const orderBy =
          input.sort === "winRate"
            ? { winRate: "desc" as const }
            : input.sort === "followers"
              ? { followerCount: "desc" as const }
              : input.sort === "earnings"
                ? { totalEarnings: "desc" as const }
                : { roi: "desc" as const }

        return await ctx.prisma.tipster.findMany({
          include: { user: { include: { profile: true } } },
          orderBy,
          take: input.limit,
        })
      } catch {
        return DEMO_TIPSTERS
      }
    }),

  byUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const profile = await ctx.prisma.profile.findUnique({
          where: { username: input.username },
          include: {
            user: {
              include: {
                tipster: { include: { achievements: true } },
                predictions: {
                  where: { status: { not: "DRAFT" } },
                  orderBy: { publishedAt: "desc" },
                  take: 20,
                },
              },
            },
          },
        })
        if (profile) return profile
      } catch {
        /* demo */
      }
      return DEMO_TIPSTERS.find(
        (t) => t.user.profile?.username === input.username
      )
    }),
})

export const leaderboardRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        metric: z
          .enum(["roi", "winRate", "followers", "earnings", "accuracy"])
          .default("roi"),
      })
    )
    .query(async () => DEMO_LEADERBOARD),
})

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        profile: true,
        tipster: true,
        wallet: true,
      },
    })
  }),

  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.profile.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          username: input.username,
          bio: input.bio,
          country: input.country,
          website: input.website || null,
          twitter: input.twitter,
          instagram: input.instagram,
          telegram: input.telegram,
        },
        update: {
          username: input.username,
          bio: input.bio,
          country: input.country,
          website: input.website || null,
          twitter: input.twitter,
          instagram: input.instagram,
          telegram: input.telegram,
        },
      })
    }),
})

export const socialRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new Error("Cannot follow yourself")
      }
      await ctx.prisma.follow.create({
        data: {
          followerId: ctx.user.id,
          followingId: input.userId,
        },
      })
      await ctx.prisma.tipster.updateMany({
        where: { userId: input.userId },
        data: { followerCount: { increment: 1 } },
      })
      return { success: true }
    }),

  like: protectedProcedure
    .input(z.object({ predictionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.like.findUnique({
        where: {
          userId_predictionId: {
            userId: ctx.user.id,
            predictionId: input.predictionId,
          },
        },
      })
      if (existing) {
        await ctx.prisma.like.delete({ where: { id: existing.id } })
        await ctx.prisma.prediction.update({
          where: { id: input.predictionId },
          data: { likesCount: { decrement: 1 } },
        })
        return { liked: false }
      }
      await ctx.prisma.like.create({
        data: {
          userId: ctx.user.id,
          predictionId: input.predictionId,
        },
      })
      await ctx.prisma.prediction.update({
        where: { id: input.predictionId },
        data: { likesCount: { increment: 1 } },
      })
      return { liked: true }
    }),

  bookmark: protectedProcedure
    .input(z.object({ predictionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.bookmark.findUnique({
        where: {
          userId_predictionId: {
            userId: ctx.user.id,
            predictionId: input.predictionId,
          },
        },
      })
      if (existing) {
        await ctx.prisma.bookmark.delete({ where: { id: existing.id } })
        return { bookmarked: false }
      }
      await ctx.prisma.bookmark.create({
        data: {
          userId: ctx.user.id,
          predictionId: input.predictionId,
        },
      })
      return { bookmarked: true }
    }),
})

export const adminRouter = createTRPCRouter({
  overview: roleProcedure(["ADMIN"]).query(async ({ ctx }) => {
    const [
      totalUsers,
      totalTipsters,
      totalPredictions,
      pendingWithdrawals,
      pendingVerifications,
      openReports,
    ] = await Promise.all([
      ctx.prisma.user.count(),
      ctx.prisma.tipster.count(),
      ctx.prisma.prediction.count(),
      ctx.prisma.withdrawal.count({ where: { status: "PENDING" } }),
      ctx.prisma.verificationRequest.count({ where: { status: "PENDING" } }),
      ctx.prisma.report.count({ where: { status: "PENDING" } }),
    ])

    const revenue = await ctx.prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    })

    return {
      totalUsers,
      totalTipsters,
      totalPredictions,
      totalRevenue: Number(revenue._sum.amount ?? 0),
      pendingWithdrawals,
      pendingVerifications,
      openReports,
    }
  }),
})

export const appRouter = createTRPCRouter({
  predictions: predictionsRouter,
  tipsters: tipstersRouter,
  leaderboard: leaderboardRouter,
  user: userRouter,
  social: socialRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
