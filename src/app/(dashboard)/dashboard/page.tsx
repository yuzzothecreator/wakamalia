import Link from "next/link"
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
import { DEMO_PREDICTIONS } from "@/lib/demo-data"
import { formatCurrency } from "@/lib/utils"
import { ROUTES } from "@/config/site"

const demoStats = {
  revenue: 3240,
  subscribers: 328,
  predictions: 214,
  winRate: 67.2,
  roi: 18.4,
  views: 8420,
  followers: 4120,
}

export default function DashboardPage() {
  const recentPredictions = DEMO_PREDICTIONS.slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tipster dashboard</h1>
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
          value={formatCurrency(demoStats.revenue)}
          icon={DollarSign}
          trend={{ value: "+12.4% vs last month", positive: true }}
        />
        <StatCard
          title="Subscribers"
          value={String(demoStats.subscribers)}
          icon={Users}
          trend={{ value: "+18 this week", positive: true }}
        />
        <StatCard
          title="Win rate"
          value={`${demoStats.winRate}%`}
          icon={Target}
          description={`ROI ${demoStats.roi}%`}
        />
        <StatCard
          title="Profile views"
          value={demoStats.views.toLocaleString()}
          icon={Eye}
          trend={{ value: "+6.2%", positive: true }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          className="lg:col-span-1"
          title="Total predictions"
          value={String(demoStats.predictions)}
          icon={BarChart3}
        />
        <StatCard
          className="lg:col-span-1"
          title="Followers"
          value={demoStats.followers.toLocaleString()}
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentPredictions.map((p) => (
            <PredictionCard key={p.id} prediction={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
