import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

const withdrawals = [
  { id: "wd1", tipster: "Amina Okello", amount: 120, method: "MPESA", status: "PENDING" },
  { id: "wd2", tipster: "James Mwangi", amount: 80, method: "BANK_TRANSFER", status: "PENDING" },
  { id: "wd3", tipster: "Sofia Nkrumah", amount: 200, method: "PAYSTACK", status: "APPROVED" },
]

export default function AdminWithdrawalsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Withdrawals</h1>
        <p className="text-muted-foreground">Approve or reject tipster payout requests.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {withdrawals.map((w) => (
            <div key={w.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{w.tipster}</p>
                <p className="text-sm text-muted-foreground">{w.method}</p>
              </div>
              <p className="font-mono font-semibold">{formatCurrency(w.amount)}</p>
              <Badge variant={w.status === "APPROVED" ? "success" : "secondary"}>
                {w.status}
              </Badge>
              {w.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button size="sm">Approve</Button>
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
