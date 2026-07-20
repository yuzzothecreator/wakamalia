import { StatCard } from "@/components/shared/stat-card"
import { DollarSign, Percent, Wallet } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { PLATFORM_COMMISSION_RATE } from "@/config/site"

const transactions = [
  { id: "tx1", type: "Subscription", amount: 29.99, date: "Jul 18, 2026" },
  { id: "tx2", type: "Premium unlock", amount: 7.5, date: "Jul 17, 2026" },
  { id: "tx3", type: "Subscription", amount: 9.99, date: "Jul 15, 2026" },
  { id: "tx4", type: "Premium unlock", amount: 4.99, date: "Jul 14, 2026" },
]

export default function EarningsPage() {
  const gross = 18400
  const net = gross * (1 - PLATFORM_COMMISSION_RATE)

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground">
          Revenue from subscriptions and premium predictions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Gross earnings" value={formatCurrency(gross)} icon={DollarSign} />
        <StatCard
          title="Platform fee"
          value={`${PLATFORM_COMMISSION_RATE * 100}%`}
          icon={Percent}
          description={formatCurrency(gross * PLATFORM_COMMISSION_RATE)}
        />
        <StatCard title="Net earnings" value={formatCurrency(net)} icon={Wallet} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Recent transactions</h2>
        </div>
        <div className="divide-y divide-border">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="font-medium">{tx.type}</p>
                <p className="text-sm text-muted-foreground">{tx.date}</p>
              </div>
              <p className="font-mono font-semibold text-emerald-600">
                +{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
