import type { PredictionCard, TipsterStats, UserPublic } from "@/types"

type ProfileLike = {
  username: string
  bio?: string | null
  country?: string | null
  coverImage?: string | null
} | null

type TipsterLike = {
  isVerified: boolean
  trustScore: number
  roi: number
  winRate: number
  totalPredictions: number
  totalWins: number
  totalLosses: number
  averageOdds: number
  monthlyProfit: number
  totalEarnings: number
  winningStreak: number
  bestStreak: number
  subscriberCount: number
  followerCount: number
  weeklyPrice: unknown
  monthlyPrice: unknown
} | null

type UserLike = {
  id: string
  name: string
  image?: string | null
  role: string
  profile?: ProfileLike
  tipster?: TipsterLike
}

type PredictionLike = {
  id: string
  title: string
  sport: string
  league?: string | null
  match: string
  homeTeam: string
  awayTeam: string
  kickoffTime: Date
  prediction: string
  odds: number
  confidence: number
  visibility: string
  price: unknown
  status: string
  views: number
  likesCount: number
  commentsCount: number
  publishedAt?: Date | null
  bookingCode?: string | null
  images?: { id?: string; url: string; alt?: string | null }[]
  tipster: UserLike
}

function num(value: unknown): number {
  if (value == null) return 0
  if (typeof value === "number") return value
  return Number(value)
}

export function toTipsterStats(tipster: NonNullable<TipsterLike>): TipsterStats {
  return {
    isVerified: tipster.isVerified,
    trustScore: tipster.trustScore,
    roi: tipster.roi,
    winRate: tipster.winRate,
    totalPredictions: tipster.totalPredictions,
    totalWins: tipster.totalWins,
    totalLosses: tipster.totalLosses,
    averageOdds: tipster.averageOdds,
    monthlyProfit: tipster.monthlyProfit,
    totalEarnings: tipster.totalEarnings,
    winningStreak: tipster.winningStreak,
    bestStreak: tipster.bestStreak,
    subscriberCount: tipster.subscriberCount,
    followerCount: tipster.followerCount,
    weeklyPrice: num(tipster.weeklyPrice),
    monthlyPrice: num(tipster.monthlyPrice),
  }
}

export function toUserPublic(user: UserLike): UserPublic {
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    role: user.role as UserPublic["role"],
    profile: user.profile
      ? {
          username: user.profile.username,
          bio: user.profile.bio,
          country: user.profile.country,
          coverImage: user.profile.coverImage,
        }
      : null,
    tipster: user.tipster ? toTipsterStats(user.tipster) : null,
  }
}

export function toPredictionCard(
  prediction: PredictionLike,
  options?: { isUnlocked?: boolean }
): PredictionCard {
  return {
    id: prediction.id,
    title: prediction.title,
    sport: prediction.sport as PredictionCard["sport"],
    league: prediction.league,
    match: prediction.match,
    homeTeam: prediction.homeTeam,
    awayTeam: prediction.awayTeam,
    kickoffTime: prediction.kickoffTime,
    prediction: prediction.prediction,
    odds: prediction.odds,
    confidence: prediction.confidence,
    visibility: prediction.visibility as PredictionCard["visibility"],
    price: num(prediction.price),
    status: prediction.status as PredictionCard["status"],
    views: prediction.views,
    likesCount: prediction.likesCount,
    commentsCount: prediction.commentsCount,
    publishedAt: prediction.publishedAt,
    bookingCode: prediction.bookingCode ?? null,
    images: prediction.images?.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
    })),
    tipster: toUserPublic(prediction.tipster),
    isUnlocked: options?.isUnlocked,
  }
}
