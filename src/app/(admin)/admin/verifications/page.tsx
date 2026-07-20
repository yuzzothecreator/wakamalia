import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

const requests = [
  {
    id: "vr1",
    name: "Sofia Nkrumah",
    username: "sofiapicks",
    submitted: "Jul 18, 2026",
    status: "PENDING",
  },
  {
    id: "vr2",
    name: "Peter O.",
    username: "peterodds",
    submitted: "Jul 15, 2026",
    status: "PENDING",
  },
]

export default function AdminVerificationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Verifications</h1>
        <p className="text-muted-foreground">Review tipster identity and track-record evidence.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <Avatar>
                <AvatarFallback>{getInitials(r.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-muted-foreground">
                  @{r.username} · submitted {r.submitted}
                </p>
              </div>
              <Badge variant="secondary">{r.status}</Badge>
              <div className="flex gap-2">
                <Button size="sm">Approve</Button>
                <Button size="sm" variant="outline">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
