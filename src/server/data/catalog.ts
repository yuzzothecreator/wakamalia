import { prisma } from "@/server/db"
import {
  DEMO_LEADERBOARD,
  DEMO_PREDICTIONS,
  DEMO_TIPSTERS,
} from "@/lib/demo-data"
import { toPredictionCard, toTipsterStats, toUserPublic } from "@/server/data/mappers"
import type { DashboardStats, LeaderboardEntry, PredictionCard } from "@/types"

const predictionInclude = {
  tipster: {
    include: { profile: true, tipster: true },
  },
} as const

export async function listPredictions(input?: {
  q?: string
  sport?: string
  visibility?: string
  tipsterId?: string
  page?: number
  limit?: number
}): Promise<{
  items: PredictionCard[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  const page = input?.page ?? 1
  const limit = input?.limit ?? 20

  try {
    const where = {
      status: { not: "DRAFT" as const },
      ...(input?.tipsterId ? { tipsterId: input.tipsterId } : {}),
      ...(input?.sport && input.sport !== "ALL"
        ? { sport: input.sport as never }
        : {}),
      ...(input?.visibility && input.visibility !== "ALL"
        ? { visibility: input.visibility as never }
        : {}),
      ...(input?.q
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
      prisma.prediction.findMany({
        where,
        include: predictionInclude,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.prediction.count({ where }),
    ])

    if (items.length > 0 || total > 0) {
      return {
        items: items.map((p) => toPredictionCard(p)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      }
    }
  } catch {
    /* fall through to demo */
  }

  let items = DEMO_PREDICTIONS
  if (input?.q) {
    const q = input.q.toLowerCase()
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.match.toLowerCase().includes(q) ||
        (p.league?.toLowerCase().includes(q) ?? false)
    )
  }

  return {
    items,
    total: items.length,
    page: 1,
    limit,
    totalPages: 1,
  }
}

export async function getPredictionById(
  id: string
): Promise<PredictionCard | null> {
  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id },
      include: predictionInclude,
    })
    if (prediction) return toPredictionCard(prediction)
  } catch {
    /* demo */
  }
  return DEMO_PREDICTIONS.find((p) => p.id === id) ?? null
}

export async function listTipsters(input?: {
  sort?: "roi" | "winRate" | "followers" | "earnings"
  q?: string
  limit?: number
}) {
  const limit = input?.limit ?? 20
  const sort = input?.sort ?? "roi"

  try {
    const orderBy =
      sort === "winRate"
        ? { winRate: "desc" as const }
        : sort === "followers"
          ? { followerCount: "desc" as const }
          : sort === "earnings"
            ? { totalEarnings: "desc" as const }
            : { roi: "desc" as const }

    const tipsters = await prisma.tipster.findMany({
      include: { user: { include: { profile: true } } },
      orderBy,
      take: limit,
    })

    if (tipsters.length > 0) {
      const mapped = tipsters.map((t) => ({
        id: t.id,
        userId: t.userId,
        ...toTipsterStats(t),
        user: toUserPublic({
          ...t.user,
          tipster: t,
        }),
      }))

      if (input?.q) {
        const q = input.q.toLowerCase()
        return mapped.filter(
          (t) =>
            t.user.name.toLowerCase().includes(q) ||
            (t.user.profile?.username.toLowerCase().includes(q) ?? false)
        )
      }
      return mapped
    }
  } catch {
    /* demo */
  }

  if (input?.q) {
    const q = input.q.toLowerCase()
    return DEMO_TIPSTERS.filter(
      (t) =>
        t.user.name.toLowerCase().includes(q) ||
        (t.user.profile?.username.toLowerCase().includes(q) ?? false)
    )
  }
  return DEMO_TIPSTERS
}

export async function getTipsterByUsername(username: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        user: {
          include: {
            tipster: true,
            predictions: {
              where: { status: { not: "DRAFT" } },
              include: predictionInclude,
              orderBy: { publishedAt: "desc" },
              take: 20,
            },
          },
        },
      },
    })

    if (profile?.user.tipster) {
      const tipster = profile.user.tipster
      return {
        username: profile.username,
        bio: profile.bio,
        country: profile.country,
        user: toUserPublic({
          ...profile.user,
          profile,
          tipster,
        }),
        stats: toTipsterStats(tipster),
        predictions: profile.user.predictions.map((p) => toPredictionCard(p)),
      }
    }
  } catch {
    /* demo */
  }

  const demo = DEMO_TIPSTERS.find(
    (t) => t.user.profile?.username === username
  )
  if (!demo) return null

  return {
    username,
    bio: demo.user.profile?.bio ?? null,
    country: demo.user.profile?.country ?? null,
    user: demo.user,
    stats: toTipsterStats(demo),
    predictions: DEMO_PREDICTIONS.filter(
      (p) => p.tipster.profile?.username === username
    ),
  }
}

export async function getLeaderboard(
  metric: "roi" | "winRate" | "followers" | "earnings" | "accuracy" = "roi"
): Promise<LeaderboardEntry[]> {
  try {
    const orderBy =
      metric === "winRate" || metric === "accuracy"
        ? { winRate: "desc" as const }
        : metric === "followers"
          ? { followerCount: "desc" as const }
          : metric === "earnings"
            ? { totalEarnings: "desc" as const }
            : { roi: "desc" as const }

    const tipsters = await prisma.tipster.findMany({
      include: { user: { include: { profile: true } } },
      orderBy,
      take: 50,
    })

    if (tipsters.length > 0) {
      return tipsters.map((tipster, index) => {
        const value =
          metric === "winRate" || metric === "accuracy"
            ? tipster.winRate
            : metric === "followers"
              ? tipster.followerCount
              : metric === "earnings"
                ? tipster.totalEarnings
                : tipster.roi

        return {
          rank: index + 1,
          tipster: toUserPublic({
            ...tipster.user,
            tipster,
          }),
          metric: Number(value),
          metricLabel:
            metric === "winRate" || metric === "accuracy"
              ? "Win rate"
              : metric === "followers"
                ? "Followers"
                : metric === "earnings"
                  ? "Earnings"
                  : "ROI",
        }
      })
    }
  } catch {
    /* demo */
  }

  return DEMO_LEADERBOARD.map((entry, index) => {
    const tipster = DEMO_TIPSTERS[index]
    const value =
      metric === "winRate" || metric === "accuracy"
        ? tipster?.winRate ?? entry.metric
        : metric === "followers"
          ? tipster?.followerCount ?? entry.metric
          : tipster?.roi ?? entry.metric

    return {
      ...entry,
      metric: Number(value),
      metricLabel:
        metric === "winRate" || metric === "accuracy"
          ? "Win rate"
          : metric === "followers"
            ? "Followers"
            : "ROI",
    }
  })
}

export async function getDashboardForUser(userId: string): Promise<{
  stats: DashboardStats
  recentPredictions: PredictionCard[]
} | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tipster: true,
        profile: true,
        predictions: {
          where: { status: { not: "DRAFT" } },
          include: predictionInclude,
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: 6,
        },
      },
    })

    if (!user) return null

    const tipster = user.tipster
    const views = user.predictions.reduce((sum, p) => sum + p.views, 0)

    return {
      stats: {
        revenue: tipster?.monthlyProfit ?? 0,
        subscribers: tipster?.subscriberCount ?? 0,
        predictions: tipster?.totalPredictions ?? user.predictions.length,
        winRate: tipster?.winRate ?? 0,
        roi: tipster?.roi ?? 0,
        views,
        followers: tipster?.followerCount ?? 0,
      },
      recentPredictions: user.predictions.map((p) =>
        toPredictionCard({
          ...p,
          tipster: {
            ...user,
            tipster,
          },
        })
      ),
    }
  } catch {
    return null
  }
}

export async function getWalletData(userId: string) {
  try {
    const [wallet, pendingWithdrawals, transactions] = await Promise.all([
      prisma.wallet.findUnique({ where: { userId } }),
      prisma.withdrawal.aggregate({
        where: { userId, status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ])

    return {
      balance: Number(wallet?.balance ?? 0),
      currency: wallet?.currency ?? "USD",
      pendingWithdrawals: Number(pendingWithdrawals._sum.amount ?? 0),
      transactions: transactions.map((t) => ({
        id: t.id,
        label: t.description ?? t.type,
        amount: Number(t.amount),
        date: t.createdAt,
      })),
    }
  } catch {
    return {
      balance: 0,
      currency: "USD",
      pendingWithdrawals: 0,
      transactions: [] as {
        id: string
        label: string
        amount: number
        date: Date
      }[],
    }
  }
}

export async function getProfileForUser(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, tipster: true, wallet: true },
    })
  } catch {
    return null
  }
}
