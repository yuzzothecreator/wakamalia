import { PrismaClient, Role, Sport, PredictionVisibility, PredictionStatus } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@wakamalia.com" },
    update: {},
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

  const tipster = await prisma.user.upsert({
    where: { email: "amina@wakamalia.com" },
    update: {},
    create: {
      name: "Amina Okello",
      email: "amina@wakamalia.com",
      emailVerified: true,
      role: Role.TIPSTER,
      profile: {
        create: {
          username: "aminaodds",
          bio: "Premier League specialist. Transparent ROI.",
          country: "Tanzania",
        },
      },
      tipster: {
        create: {
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
      },
      wallet: { create: { balance: 420.5, currency: "USD" } },
    },
  })

  const existing = await prisma.prediction.count({
    where: { tipsterId: tipster.id },
  })

  if (existing === 0) {
    await prisma.prediction.createMany({
      data: [
        {
          tipsterId: tipster.id,
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
        },
        {
          tipsterId: tipster.id,
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
        },
      ],
    })
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

  console.log("Seeded:", { admin: admin.email, tipster: tipster.email })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
