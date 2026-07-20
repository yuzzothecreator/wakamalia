import Link from "next/link"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const notifications = [
  {
    id: "n1",
    title: "New subscriber",
    body: "Daniel K. subscribed to your monthly plan.",
    href: "/dashboard/subscribers",
    read: false,
    time: "2h ago",
  },
  {
    id: "n2",
    title: "Prediction settled — WON",
    body: "Arsenal -0.5 was marked as won.",
    href: "/predictions/p1",
    read: false,
    time: "5h ago",
  },
  {
    id: "n3",
    title: "Withdrawal approved",
    body: "Your M-Pesa withdrawal of $120 was processed.",
    href: "/dashboard/withdrawals",
    read: true,
    time: "1d ago",
  },
]

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your account activity.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {notifications.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              className="flex gap-4 px-5 py-4 transition-colors hover:bg-secondary/50"
            >
              <div className="mt-1 size-2 shrink-0 rounded-full bg-primary opacity-0 data-[unread=true]:opacity-100" data-unread={!n.read} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{n.title}</p>
                  {!n.read && <Badge variant="secondary">New</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
