import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DEMO_PREDICTIONS } from "@/lib/demo-data"

export default function AdminPredictionsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Predictions</h1>
        <p className="text-muted-foreground">Moderate and settle platform predictions.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {DEMO_PREDICTIONS.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  @{p.tipster.profile?.username} · {p.match}
                </p>
              </div>
              <Badge
                variant={
                  p.status === "WON" ? "success" : p.status === "LOST" ? "danger" : "secondary"
                }
              >
                {p.status}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/predictions/${p.id}`}>View</Link>
                </Button>
                <Button variant="ghost" size="sm">Settle</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
