import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

const payments = [
  { id: "pay1", user: "Daniel K.", amount: 29.99, provider: "STRIPE", status: "COMPLETED", date: "Jul 19" },
  { id: "pay2", user: "Grace M.", amount: 50, provider: "MPESA", status: "COMPLETED", date: "Jul 18" },
  { id: "pay3", user: "Ibrahim S.", amount: 7.5, provider: "WALLET", status: "COMPLETED", date: "Jul 17" },
  { id: "pay4", user: "Lucia P.", amount: 20, provider: "FLUTTERWAVE", status: "PENDING", date: "Jul 19" },
]

export default function AdminPaymentsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">All deposits, subscriptions, and unlocks.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {payments.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.user}</p>
                <p className="text-sm text-muted-foreground">
                  {p.provider} · {p.date}
                </p>
              </div>
              <p className="font-mono font-semibold">{formatCurrency(p.amount)}</p>
              <Badge variant={p.status === "COMPLETED" ? "success" : "secondary"}>
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
