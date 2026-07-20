import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const reports = [
  {
    id: "rp1",
    target: "Prediction p4",
    reason: "Misleading odds screenshot attached",
    reporter: "user_42",
    status: "PENDING",
  },
  {
    id: "rp2",
    target: "User @spamtips",
    reason: "Repeated unsolicited premium DMs",
    reporter: "user_18",
    status: "PENDING",
  },
]

export default function AdminReportsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Community safety and content moderation.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {reports.map((r) => (
            <div key={r.id} className="space-y-3 px-5 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium">{r.target}</p>
                <Badge variant="secondary">{r.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{r.reason}</p>
              <p className="text-xs text-muted-foreground">Reported by {r.reporter}</p>
              <div className="flex gap-2">
                <Button size="sm">Resolve</Button>
                <Button size="sm" variant="outline">
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
