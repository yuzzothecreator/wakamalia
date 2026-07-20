import { StatCard } from "@/components/shared/stat-card"
import { Eye, Heart, Target, TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const weeklyData = [
  { week: "W1", views: 820, likes: 64, wins: 5 },
  { week: "W2", views: 1040, likes: 88, wins: 6 },
  { week: "W3", views: 980, likes: 72, wins: 4 },
  { week: "W4", views: 1280, likes: 96, wins: 7 },
]

export default function AnalyticsPage() {
  const maxViews = Math.max(...weeklyData.map((d) => d.views))

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Engagement and performance trends for your predictions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="30-day views" value="4,120" icon={Eye} trend={{ value: "+14%", positive: true }} />
        <StatCard title="Engagement rate" value="8.2%" icon={Heart} />
        <StatCard title="Settled win rate" value="67.2%" icon={Target} />
        <StatCard title="ROI (30d)" value="+18.4%" icon={TrendingUp} trend={{ value: "Above platform avg", positive: true }} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly views</CardTitle>
          <CardDescription>Last 4 weeks of profile and prediction views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-end gap-4">
            {weeklyData.map((d) => (
              <div key={d.week} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-primary/80 transition-all"
                  style={{ height: `${(d.views / maxViews) * 100}%`, minHeight: "8px" }}
                />
                <span className="text-xs text-muted-foreground">{d.week}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top performing picks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: "Arsenal -0.5", roi: "+24%", status: "WON" },
            { title: "Over 2.5 Real Madrid", roi: "+18%", status: "WON" },
            { title: "Lakers Over 226.5", roi: "-100%", status: "LOST" },
          ].map((pick) => (
            <div
              key={pick.title}
              className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3"
            >
              <span className="font-medium">{pick.title}</span>
              <div className="flex items-center gap-3 text-sm">
                <span className={pick.status === "WON" ? "text-emerald-600" : "text-red-600"}>
                  {pick.roi}
                </span>
                <span className="text-muted-foreground">{pick.status}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
