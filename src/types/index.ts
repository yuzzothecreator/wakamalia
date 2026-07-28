export type Role = "GUEST" | "SUBSCRIBER" | "TIPSTER" | "ADMIN"

export type Sport =
  | "FOOTBALL"
  | "BASKETBALL"
  | "TENNIS"
  | "CRICKET"
  | "RUGBY"
  | "MMA"
  | "HORSE_RACING"
  | "OTHER"

export type PredictionVisibility = "FREE" | "PREMIUM"
export type PredictionStatus =
  | "PENDING"
  | "WON"
  | "LOST"
  | "VOID"
  | "DRAFT"
  | "SCHEDULED"

export interface UserPublic {
  id: string
  name: string
  image?: string | null
  role: Role
  profile?: {
    username: string
    bio?: string | null
    country?: string | null
    coverImage?: string | null
  } | null
  tipster?: TipsterStats | null
}

export interface TipsterStats {
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
  weeklyPrice: number
  monthlyPrice: number
}

export interface PredictionCard {
  id: string
  title: string
  sport: Sport
  league?: string | null
  match: string
  homeTeam: string
  awayTeam: string
  kickoffTime: string | Date
  prediction: string
  odds: number
  confidence: number
  visibility: PredictionVisibility
  price: number
  status: PredictionStatus
  views: number
  likesCount: number
  commentsCount: number
  publishedAt?: string | Date | null
  bookingCode?: string | null
  images?: { id?: string; url: string; alt?: string | null }[]
  tipster: UserPublic
  isLiked?: boolean
  isBookmarked?: boolean
  isUnlocked?: boolean
}

export interface LeaderboardEntry {
  rank: number
  tipster: UserPublic
  metric: number
  metricLabel: string
}

export interface WalletSummary {
  balance: number
  currency: string
  pendingWithdrawals: number
}

export interface DashboardStats {
  revenue: number
  subscribers: number
  predictions: number
  winRate: number
  roi: number
  views: number
  followers: number
}

export interface AdminOverview {
  totalUsers: number
  totalTipsters: number
  totalPredictions: number
  totalRevenue: number
  pendingWithdrawals: number
  pendingVerifications: number
  openReports: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
