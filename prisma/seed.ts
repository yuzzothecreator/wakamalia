import {
  PrismaClient,
  Role,
  Sport,
  PredictionVisibility,
  PredictionStatus,
} from "@prisma/client"
import { hashPassword } from "better-auth/crypto"

const prisma = new PrismaClient()

const SEED_PASSWORD = "Password1"

async function ensureCredentialAccount(userId: string, email: string) {
  const existing = await prisma.account.findFirst({
    where: { userId, providerId: "credential" },
  })
  if (existing?.password) return

  const password = await hashPassword(SEED_PASSWORD)
  if (existing) {
    await prisma.account.update({
      where: { id: existing.id },
      data: { password },
    })
    return
  }

  await prisma.account.create({
    data: {
      userId,
      accountId: email,
      providerId: "credential",
      password,
    },
  })
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@wakamalia.com" },
    update: { role: Role.ADMIN, emailVerified: true },
    create: {
      name: "Wakamalia Admin",
      email: "admin@wakamalia.com",
      emailVerified: true,
      role: Role.ADMIN,
      profile: {
        create: {
          username: "admin",
          bio: "Platform administrator",
          country: "Tanzania",
        },
      },
      wallet: { create: { balance: 0, currency: "USD" } },
    },
  })
  await ensureCredentialAccount(admin.id, admin.email)

  const tipsterSeeds = [
    {
      email: "amina@wakamalia.com",
      name: "Amina Okello",
      username: "aminaodds",
      bio: "Premier League specialist. Transparent ROI.",
      country: "Tanzania",
      tipster: {
        isVerified: true,
        trustScore: 94,
        roi: 24.8,
        winRate: 71.5,
        totalPredictions: 214,
        totalWins: 144,
        totalLosses: 70,
        averageOdds: 1.92,
        monthlyProfit: 1240,
        totalEarnings: 18400,
        winningStreak: 5,
        bestStreak: 12,
        subscriberCount: 328,
        followerCount: 8200,
        weeklyPrice: 9.99,
        monthlyPrice: 29.99,
      },
      walletBalance: 420.5,
    },
    {
      email: "james@wakamalia.com",
      name: "James Mwangi",
      username: "jmwangi",
      bio: "La Liga and African leagues value hunter.",
      country: "Kenya",
      tipster: {
        isVerified: true,
        trustScore: 88,
        roi: 19.2,
        winRate: 68.1,
        totalPredictions: 168,
        totalWins: 114,
        totalLosses: 54,
        averageOdds: 1.88,
        monthlyProfit: 860,
        totalEarnings: 11200,
        winningStreak: 3,
        bestStreak: 9,
        subscriberCount: 210,
        followerCount: 5400,
        weeklyPrice: 7.99,
        monthlyPrice: 24.99,
      },
      walletBalance: 210,
    },
    {
      email: "sofia@wakamalia.com",
      name: "Sofia Nkrumah",
      username: "sofiapicks",
      bio: "NBA totals and player props with disciplined staking.",
      country: "Ghana",
      tipster: {
        isVerified: false,
        trustScore: 76,
        roi: 16.5,
        winRate: 64.0,
        totalPredictions: 132,
        totalWins: 84,
        totalLosses: 48,
        averageOdds: 1.95,
        monthlyProfit: 540,
        totalEarnings: 6800,
        winningStreak: 2,
        bestStreak: 7,
        subscriberCount: 95,
        followerCount: 3900,
        weeklyPrice: 5.99,
        monthlyPrice: 19.99,
      },
      walletBalance: 95.25,
    },
  ] as const

  const tipsters = []
  for (const seed of tipsterSeeds) {
    const user = await prisma.user.upsert({
      where: { email: seed.email },
      update: { role: Role.TIPSTER, emailVerified: true, name: seed.name },
      create: {
        name: seed.name,
        email: seed.email,
        emailVerified: true,
        role: Role.TIPSTER,
        profile: {
          create: {
            username: seed.username,
            bio: seed.bio,
            country: seed.country,
          },
        },
        tipster: { create: seed.tipster },
        wallet: { create: { balance: seed.walletBalance, currency: "USD" } },
      },
    })

    await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        username: seed.username,
        bio: seed.bio,
        country: seed.country,
      },
      update: {
        username: seed.username,
        bio: seed.bio,
        country: seed.country,
      },
    })

    await prisma.tipster.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...seed.tipster },
      update: seed.tipster,
    })

    await prisma.wallet.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        balance: seed.walletBalance,
        currency: "USD",
      },
      update: { balance: seed.walletBalance },
    })

    await ensureCredentialAccount(user.id, user.email)
    tipsters.push(user)
  }

  const [amina, james, sofia] = tipsters

  const predictionCount = await prisma.prediction.count()
  if (predictionCount === 0 && amina && james && sofia) {
    await prisma.prediction.createMany({
      data: [
        {
          tipsterId: amina.id,
          title: "Arsenal value on Asian Handicap -0.5",
          sport: Sport.FOOTBALL,
          league: "Premier League",
          match: "Arsenal vs Brighton",
          homeTeam: "Arsenal",
          awayTeam: "Brighton",
          kickoffTime: new Date(Date.now() + 36e5 * 8),
          prediction: "Arsenal -0.5",
          odds: 1.85,
          confidence: 8,
          visibility: PredictionVisibility.FREE,
          status: PredictionStatus.PENDING,
          publishedAt: new Date(),
          tags: ["PL", "AH"],
          likesCount: 96,
          commentsCount: 18,
          views: 1284,
        },
        {
          tipsterId: amina.id,
          title: "Double chance bank — away form edge",
          sport: Sport.FOOTBALL,
          league: "Serie A",
          match: "Napoli vs Inter",
          homeTeam: "Napoli",
          awayTeam: "Inter",
          kickoffTime: new Date(Date.now() + 36e5 * 48),
          prediction: "X2 (Draw or Inter)",
          odds: 1.55,
          confidence: 9,
          visibility: PredictionVisibility.PREMIUM,
          price: 7.5,
          status: PredictionStatus.PENDING,
          publishedAt: new Date(),
          tags: ["SerieA", "Premium"],
          likesCount: 33,
          commentsCount: 4,
          views: 512,
        },
        {
          tipsterId: james.id,
          title: "Over 2.5 goals — high xG clash",
          sport: Sport.FOOTBALL,
          league: "La Liga",
          match: "Real Madrid vs Sevilla",
          homeTeam: "Real Madrid",
          awayTeam: "Sevilla",
          kickoffTime: new Date(Date.now() + 36e5 * 20),
          prediction: "Over 2.5 Goals",
          odds: 1.72,
          confidence: 7,
          visibility: PredictionVisibility.PREMIUM,
          price: 4.99,
          status: PredictionStatus.PENDING,
          publishedAt: new Date(),
          tags: ["LaLiga"],
          likesCount: 54,
          commentsCount: 9,
          views: 842,
        },
        {
          tipsterId: sofia.id,
          title: "NBA totals play — paced matchup",
          sport: Sport.BASKETBALL,
          league: "NBA",
          match: "Lakers vs Celtics",
          homeTeam: "Lakers",
          awayTeam: "Celtics",
          kickoffTime: new Date(Date.now() - 864e5),
          prediction: "Over 226.5",
          odds: 1.91,
          confidence: 6,
          visibility: PredictionVisibility.FREE,
          status: PredictionStatus.WON,
          publishedAt: new Date(Date.now() - 864e5 * 2),
          settledAt: new Date(Date.now() - 864e5),
          tags: ["NBA"],
          likesCount: 188,
          commentsCount: 41,
          views: 2103,
        },
      ],
    })
  }

  if (amina) {
    const txCount = await prisma.transaction.count({
      where: { userId: amina.id },
    })
    if (txCount === 0) {
      await prisma.transaction.createMany({
        data: [
          {
            userId: amina.id,
            type: "DEPOSIT",
            amount: 50,
            balanceAfter: 420.5,
            description: "Wallet deposit",
          },
          {
            userId: amina.id,
            type: "EARNING",
            amount: 29.99,
            balanceAfter: 370.5,
            description: "Subscription payout",
          },
          {
            userId: amina.id,
            type: "EARNING",
            amount: 7.5,
            balanceAfter: 340.51,
            description: "Premium unlock sale",
          },
        ],
      })
    }
  }

  await prisma.platformSetting.upsert({
    where: { key: "commission_rate" },
    update: { value: 0.15 },
    create: { key: "commission_rate", value: 0.15 },
  })

  await prisma.blogPost.upsert({
    where: { slug: "welcome-to-wakamalia" },
    update: {},
    create: {
      slug: "welcome-to-wakamalia",
      title: "Welcome to Wakamalia",
      excerpt: "Build trust. Monetize tips. Grow your audience.",
      content:
        "Wakamalia is the social marketplace for sports tipsters who care about verified performance and sustainable creator income.",
      published: true,
      authorName: "Wakamalia Team",
      publishedAt: new Date(),
    },
  })

  console.log("Seeded accounts (password: Password1):")
  console.log("- admin@wakamalia.com")
  console.log("- amina@wakamalia.com")
  console.log("- james@wakamalia.com")
  console.log("- sofia@wakamalia.com")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
