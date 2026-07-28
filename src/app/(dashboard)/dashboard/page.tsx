import Link from "next/link"
import { redirect } from "next/navigation"
import {
  BarChart3,
  DollarSign,
  Eye,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { PredictionCard } from "@/components/predictions/prediction-card"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { getDashboardForUser } from "@/server/data/catalog"
import { formatCurrency } from "@/lib/utils"
import { ROUTES } from "@/config/site"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) redirect(ROUTES.login)

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
