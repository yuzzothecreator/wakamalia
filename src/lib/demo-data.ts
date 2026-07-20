import type { PredictionCard, LeaderboardEntry, UserPublic } from "@/types"

const tipsterBase = (
  id: string,
  name: string,
  username: string,
  stats: Partial<NonNullable<UserPublic["tipster"]>> = {}
): UserPublic => ({
  id,
  name,
  image: null,
  role: "TIPSTER",
  profile: {
    username,
    bio: "Verified performance tipster on Wakamalia.",
    country: "Tanzania",
    coverImage: null,
  },
  tipster: {
    isVerified: true,
    trustScore: 92,
    roi: 18.4,
    winRate: 67.2,
    totalPredictions: 214,
    totalWins: 144,
    totalLosses: 70,
    averageOdds: 1.92,
    monthlyProfit: 1240,
    totalEarnings: 18400,
    winningStreak: 5,
    bestStreak: 12,
    subscriberCount: 328,
    followerCount: 4120,
    weeklyPrice: 9.99,
    monthlyPrice: 29.99,
    ...stats,
  },
})

export const DEMO_TIPSTERS = [
  {
    id: "t1",
    userId: "u1",
    ...tipsterBase("u1", "Amina Okello", "aminaodds", {
      roi: 24.8,
      winRate: 71.5,
      followerCount: 8200,
    }).tipster!,
    user: tipsterBase("u1", "Amina Okello", "aminaodds", {
      roi: 24.8,
      winRate: 71.5,
      followerCount: 8200,
    }),
  },
  {
    id: "t2",
    userId: "u2",
    ...tipsterBase("u2", "James Mwangi", "jmwangi", {
      roi: 19.2,
      winRate: 68.1,
      followerCount: 5400,
    }).tipster!,
    user: tipsterBase("u2", "James Mwangi", "jmwangi", {
      roi: 19.2,
      winRate: 68.1,
      followerCount: 5400,
    }),
  },
  {
    id: "t3",
    userId: "u3",
    ...tipsterBase("u3", "Sofia Nkrumah", "sofiapicks", {
      roi: 16.5,
      winRate: 64.0,
      followerCount: 3900,
      isVerified: false,
    }).tipster!,
    user: tipsterBase("u3", "Sofia Nkrumah", "sofiapicks", {
      roi: 16.5,
      winRate: 64.0,
      followerCount: 3900,
      isVerified: false,
    }),
  },
]

export const DEMO_PREDICTIONS: PredictionCard[] = [
  {
    id: "p1",
    title: "Arsenal value on Asian Handicap -0.5",
    sport: "FOOTBALL",
    league: "Premier League",
    match: "Arsenal vs Brighton",
    homeTeam: "Arsenal",
    awayTeam: "Brighton",
    kickoffTime: new Date(Date.now() + 36e5 * 8).toISOString(),
    prediction: "Arsenal -0.5",
    odds: 1.85,
    confidence: 8,
    visibility: "FREE",
    price: 0,
    status: "PENDING",
    views: 1284,
    likesCount: 96,
    commentsCount: 18,
    publishedAt: new Date().toISOString(),
    tipster: tipsterBase("u1", "Amina Okello", "aminaodds", {
      roi: 24.8,
      winRate: 71.5,
    }),
  },
  {
    id: "p2",
    title: "Over 2.5 goals — high xG clash",
    sport: "FOOTBALL",
    league: "La Liga",
    match: "Real Madrid vs Sevilla",
    homeTeam: "Real Madrid",
    awayTeam: "Sevilla",
    kickoffTime: new Date(Date.now() + 36e5 * 20).toISOString(),
    prediction: "Over 2.5 Goals",
    odds: 1.72,
    confidence: 7,
    visibility: "PREMIUM",
    price: 4.99,
    status: "PENDING",
    views: 842,
    likesCount: 54,
    commentsCount: 9,
    publishedAt: new Date().toISOString(),
    tipster: tipsterBase("u2", "James Mwangi", "jmwangi"),
  },
  {
    id: "p3",
    title: "NBA totals play — paced matchup",
    sport: "BASKETBALL",
    league: "NBA",
    match: "Lakers vs Celtics",
    homeTeam: "Lakers",
    awayTeam: "Celtics",
    kickoffTime: new Date(Date.now() + 36e5 * 30).toISOString(),
    prediction: "Over 226.5",
    odds: 1.91,
    confidence: 6,
    visibility: "FREE",
    price: 0,
    status: "WON",
    views: 2103,
    likesCount: 188,
    commentsCount: 41,
    publishedAt: new Date(Date.now() - 864e5).toISOString(),
    tipster: tipsterBase("u3", "Sofia Nkrumah", "sofiapicks", {
      isVerified: false,
    }),
  },
  {
    id: "p4",
    title: "Double chance bank — away form edge",
    sport: "FOOTBALL",
    league: "Serie A",
    match: "Napoli vs Inter",
    homeTeam: "Napoli",
    awayTeam: "Inter",
    kickoffTime: new Date(Date.now() + 36e5 * 48).toISOString(),
    prediction: "X2 (Draw or Inter)",
    odds: 1.55,
    confidence: 9,
    visibility: "PREMIUM",
    price: 7.5,
    status: "PENDING",
    views: 512,
    likesCount: 33,
    commentsCount: 4,
    publishedAt: new Date().toISOString(),
    tipster: tipsterBase("u1", "Amina Okello", "aminaodds"),
    isUnlocked: false,
  },
]

export const DEMO_LEADERBOARD: LeaderboardEntry[] = DEMO_TIPSTERS.map(
  (t, i) => ({
    rank: i + 1,
    tipster: t.user,
    metric: t.roi,
    metricLabel: "ROI",
  })
)

export const DEMO_TESTIMONIALS = [
  {
    name: "Daniel K.",
    role: "Subscriber",
    quote:
      "Wakamalia is the first tipster platform where I can actually verify long-term ROI before I subscribe.",
  },
  {
    name: "Grace M.",
    role: "Verified Tipster",
    quote:
      "I went from posting free tips on Telegram to a real subscriber business with transparent stats.",
  },
  {
    name: "Ibrahim S.",
    role: "Premium buyer",
    quote:
      "Wallet, M-Pesa, and bank transfer in one place made it easy to support tipsters I trust.",
  },
]

export const DEMO_FAQS = [
  {
    q: "How does tipster verification work?",
    a: "Tipsters submit identity and track-record evidence. Admins review performance transparency, then issue a verification badge.",
  },
  {
    q: "Can I sell both free and premium predictions?",
    a: "Yes. Free tips grow your audience. Premium slips and subscriptions create recurring revenue with platform commission.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Stripe, Flutterwave, Paystack, AzamPay, M-Pesa, wallet balance, and manual bank transfer.",
  },
  {
    q: "How is ROI calculated?",
    a: "ROI is based on settled predictions with a consistent unit stake model, updated after win/loss verification.",
  },
  {
    q: "Is Wakamalia available in Swahili?",
    a: "Yes. The product supports English and Kiswahili locales.",
  },
]
