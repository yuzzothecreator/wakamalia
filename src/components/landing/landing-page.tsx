"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PredictionCard } from "@/components/predictions/prediction-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DEMO_FAQS,
  DEMO_PREDICTIONS,
  DEMO_TESTIMONIALS,
  DEMO_TIPSTERS,
} from "@/lib/demo-data"
import { APP_NAME, APP_TAGLINE, ROUTES } from "@/config/site"
import { formatNumber, formatPercent, getInitials } from "@/lib/utils"

const features = [
  {
    icon: Shield,
    title: "Verified performance",
    description:
      "Trust scores, ROI, and win rates tracked from settled results — not self-reported screenshots.",
  },
  {
    icon: Wallet,
    title: "Creator monetization",
    description:
      "Subscriptions, premium slips, wallet payouts, and regional payment rails built for Africa and beyond.",
  },
  {
    icon: Users,
    title: "Social growth engine",
    description:
      "Followers, comments, DMs, and activity feeds that help tipsters turn expertise into community.",
  },
  {
    icon: BarChart3,
    title: "Analytics that matter",
    description:
      "Views, sales, subscriber growth, and profit reports in a creator dashboard designed for clarity.",
  },
]

const stats = [
  { label: "Active tipsters", value: "2,400+" },
  { label: "Predictions settled", value: "180K+" },
  { label: "Avg. verified win rate", value: "64%" },
  { label: "Creator payouts", value: "$1.2M+" },
]

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Badge variant="secondary" className="rounded-lg px-3 py-1">
              Social marketplace for sports tipsters
            </Badge>
            <div>
              <p className="mb-3 text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                {APP_NAME}
              </p>
              <h1 className="max-w-xl text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
                {APP_TAGLINE}
              </h1>
            </div>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              Post free or premium predictions, prove your edge with transparent
              stats, grow subscribers, and get paid through wallet, M-Pesa,
              Stripe, and more.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={ROUTES.register}>
                  Become a Tipster
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.explore}>Browse Predictions</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-accent/20 blur-2xl" />
            <div className="glass relative rounded-3xl p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">Live marketplace</p>
                <Badge variant="success">Settled · Verified</Badge>
              </div>
              <div className="space-y-3">
                {DEMO_PREDICTIONS.slice(0, 2).map((p) => (
                  <PredictionCard key={p.id} prediction={p} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="font-mono text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top tipsters */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Top tipsters
          </h2>
          <p className="mt-2 text-muted-foreground text-pretty">
            Ranked by verified ROI, win rate, and community trust — not hype.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {DEMO_TIPSTERS.map((t, i) => (
            <Link
              key={t.id}
              href={`/tipsters/${t.user.profile?.username}`}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback>{getInitials(t.user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">
                      {t.user.profile?.username}
                    </span>
                    {t.isVerified && (
                      <BadgeCheck className="size-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    #{i + 1} · {formatNumber(t.followerCount)} followers
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-mono text-lg font-bold text-emerald-600">
                    {formatPercent(t.roi)}
                  </p>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold">
                    {t.winRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Win rate</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold">{t.winningStreak}</p>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Trending predictions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Free tips and premium slips gaining traction right now.
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href={ROUTES.explore}>View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {DEMO_PREDICTIONS.map((p) => (
              <PredictionCard key={p.id} prediction={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest winners */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">Latest winners</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Recently settled picks that hit — with transparent odds and tipster
          attribution.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Match</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Pick
                </th>
                <th className="px-4 py-3 font-medium">Odds</th>
                <th className="px-4 py-3 font-medium">Tipster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DEMO_PREDICTIONS.filter((p) => p.status === "WON").map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{p.match}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {p.prediction}
                  </td>
                  <td className="px-4 py-3 font-mono">{p.odds.toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    @{p.tipster.profile?.username}
                  </td>
                </tr>
              ))}
              {DEMO_PREDICTIONS.filter((p) => p.status === "WON").length ===
                0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Winners will appear here as predictions settle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Built for trust and income
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything tipsters and subscribers need in one modern platform.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-primary">
                <TrendingUp className="size-5" />
                <span className="text-sm font-medium">Creator pricing</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-balance">
                Keep more of what you earn
              </h2>
              <p className="mt-3 text-muted-foreground text-pretty">
                Set weekly or monthly subscription prices, sell premium slips,
                and withdraw via M-Pesa, bank transfer, or Stripe. Platform
                commission is transparent.
              </p>
              <Button className="mt-6" asChild>
                <Link href={ROUTES.pricing}>View pricing</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Free tipster", price: "$0", desc: "Post free tips, build audience" },
                { title: "Pro tipster", price: "15%", desc: "Commission on paid sales only" },
                { title: "Featured slot", price: "Boost", desc: "Homepage & explore placement" },
                { title: "Affiliate", price: "Earn", desc: "Referral rewards on signups" },
              ].map((plan) => (
                <div
                  key={plan.title}
                  className="rounded-2xl border border-border bg-secondary/50 p-4"
                >
                  <p className="text-sm text-muted-foreground">{plan.title}</p>
                  <p className="mt-1 font-mono text-2xl font-bold">{plan.price}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">What people say</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {DEMO_TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="text-sm leading-relaxed text-pretty">“{t.quote}”</p>
                <footer className="mt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">FAQs</h2>
            <Accordion type="single" collapsible className="mt-6">
              {DEMO_FAQS.map((faq, i) => (
                <AccordionItem key={faq.q} value={`item-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight">
              Stay ahead of the markets
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Weekly digest of top tipsters, settled ROI leaders, and product
              updates. No spam.
            </p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              action="/api/newsletter"
              method="post"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                required
                placeholder="you@email.com"
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
