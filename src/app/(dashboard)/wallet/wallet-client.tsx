"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Wallet as WalletIcon } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { depositAction } from "@/actions/wallet"
import { depositSchema } from "@/lib/validations"
import { PAYMENT_PROVIDERS } from "@/config/site"
import { formatCurrency } from "@/lib/utils"
import type { z } from "zod"

type DepositInput = z.infer<typeof depositSchema>

type ActivityItem = {
  id: string
  label: string
  amount: number
  date: string
}

export function WalletClient({
  balance,
  pendingWithdrawals,
  activity,
}: {
  balance: number
  pendingWithdrawals: number
  activity: ActivityItem[]
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<DepositInput>({
    resolver: zodResolver(depositSchema) as never,
    defaultValues: { provider: "MPESA", amount: 20 },
  })

  async function onSubmit(data: DepositInput) {
    const result = await depositAction(data)
    if (!result.success) {
      toast.error(result.error ?? "Deposit failed")
      return
    }
    if (result.data?.checkoutUrl) {
      toast.success("Redirecting to checkout…")
      window.location.href = result.data.checkoutUrl
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Top up and pay for premium predictions and subscriptions.
        </p>
      </div>

      <StatCard
        title="Available balance"
        value={formatCurrency(balance)}
        icon={WalletIcon}
        description={`Pending withdrawals: ${formatCurrency(pendingWithdrawals)}`}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="font-semibold">Add funds</h2>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input id="amount" type="number" {...register("amount")} />
        </div>
        <div className="space-y-2">
          <Label>Payment method</Label>
          <Select
            defaultValue="MPESA"
            onValueChange={(v) =>
              setValue("provider", v as DepositInput["provider"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_PROVIDERS.filter((p) => p.value !== "WALLET").map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing…" : "Continue to payment"}
        </Button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Recent activity</h2>
        </div>
        <div className="divide-y divide-border">
          {activity.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No wallet activity yet.
            </p>
          ) : (
            activity.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <span
                  className={`font-mono font-semibold ${
                    a.amount >= 0 ? "text-emerald-600" : "text-foreground"
                  }`}
                >
                  {a.amount >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(a.amount))}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
