import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils"

const subscribers = [
  { id: "s1", name: "Daniel K.", plan: "Monthly", since: "Mar 2026", status: "ACTIVE" },
  { id: "s2", name: "Grace M.", plan: "Weekly", since: "Jun 2026", status: "ACTIVE" },
  { id: "s3", name: "Ibrahim S.", plan: "Monthly", since: "Feb 2026", status: "ACTIVE" },
  { id: "s4", name: "Lucia P.", plan: "Weekly", since: "Jul 2026", status: "TRIAL" },
]

export default function SubscribersPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscribers</h1>
        <p className="text-muted-foreground">
          {subscribers.length} active subscribers on your plans.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <Avatar>
                <AvatarImage />
                <AvatarFallback>{getInitials(sub.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{sub.name}</p>
                <p className="text-sm text-muted-foreground">
                  {sub.plan} · since {sub.since}
                </p>
              </div>
              <Badge variant={sub.status === "ACTIVE" ? "success" : "secondary"}>
                {sub.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
