import Link from "next/link"
import { redirect } from "next/navigation"
import {
  BarChart3,
  DollarSign,
  Eye,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { PredictionCard } from "@/components/predictions/prediction-card"
import { Button } from "@/components/ui/button"
import { getSession, getDbUserRole } from "@/lib/session"
import { getDashboardForUser } from "@/server/data/catalog"
import { formatCurrency } from "@/lib/utils"
import { ROUTES } from "@/config/site"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) redirect(ROUTES.login)

  const role = await getDbUserRole(session.user.id)
  const isCreator = role === "TIPSTER" || role === "ADMIN"

  if (!isCreator) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Follow tipsters, unlock premium tips, and manage your wallet.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">
            Ready to publish tips?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Activate a tipster account to post free and premium predictions, grow
            subscribers, and earn from unlocks.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={ROUTES.dashboard.become}>Become a tipster</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.tips}>Browse today&apos;s tips</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button asChild variant="outline" className="h-auto flex-col gap-1 py-4">
            <Link href={ROUTES.wallet}>
              <span className="font-semibold">Wallet</span>
              <span className="text-xs text-muted-foreground">Deposit & unlock</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-1 py-4">
            <Link href={ROUTES.explore}>
              <span className="font-semibold">Explore</span>
              <span className="text-xs text-muted-foreground">Find tipsters</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-1 py-4">
            <Link href={ROUTES.settings}>
              <span className="font-semibold">Settings</span>
              <span className="text-xs text-muted-foreground">Profile & security</span>
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const dashboard = await getDashboardForUser(session.user.id)
  const stats = dashboard?.stats ?? {
    revenue: 0,
    subscribers: 0,
    predictions: 0,
    winRate: 0,
    roi: 0,
    views: 0,
    followers: 0,
  }
  const recentPredictions = dashboard?.recentPredictions ?? []

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tipster dashboard
          </h1>
          <p className="text-muted-foreground">
            Track performance, subscribers, and earnings at a glance.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.dashboard.create}>New prediction</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly revenue"
          value={formatCurrency(stats.revenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Subscribers"
          value={String(stats.subscribers)}
          icon={Users}
        />
        <StatCard
          title="Win rate"
          value={`${stats.winRate}%`}
          icon={Target}
          description={`ROI ${stats.roi}%`}
        />
        <StatCard
          title="Profile views"
          value={stats.views.toLocaleString()}
          icon={Eye}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          className="lg:col-span-1"
          title="Total predictions"
          value={String(stats.predictions)}
          icon={BarChart3}
        />
        <StatCard
          className="lg:col-span-1"
          title="Followers"
          value={stats.followers.toLocaleString()}
          icon={TrendingUp}
        />
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
          <p className="text-sm text-muted-foreground">Quick actions</p>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.dashboard.analytics}>View analytics</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.dashboard.withdrawals}>Request withdrawal</Link>
            </Button>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent predictions</h2>
          <Link
            href={ROUTES.explore}
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {recentPredictions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No predictions yet.{" "}
            <Link href={ROUTES.dashboard.create} className="text-primary hover:underline">
              Create your first pick
            </Link>
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentPredictions.map((p) => (
              <PredictionCard key={p.id} prediction={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
