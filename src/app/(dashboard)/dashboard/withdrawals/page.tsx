"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
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
import { Badge } from "@/components/ui/badge"
import { requestWithdrawalAction } from "@/actions/wallet"
import { withdrawalSchema } from "@/lib/validations"
import { PAYMENT_PROVIDERS, MIN_WITHDRAWAL_AMOUNT } from "@/config/site"
import { formatCurrency } from "@/lib/utils"
import type { z } from "zod"

type WithdrawalInput = z.infer<typeof withdrawalSchema>

const history = [
  { id: "w1", amount: 120, method: "MPESA", status: "COMPLETED", date: "Jul 10" },
  { id: "w2", amount: 80, method: "BANK_TRANSFER", status: "PENDING", date: "Jul 19" },
]

export default function WithdrawalsPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<WithdrawalInput>({
    resolver: zodResolver(withdrawalSchema) as never,
    defaultValues: { method: "MPESA", accountInfo: {} },
  })

  async function onSubmit(data: WithdrawalInput) {
    const result = await requestWithdrawalAction(data)
    if (!result.success) {
      toast.error(result.error ?? "Withdrawal failed")
      return
    }
    toast.success(result.message ?? "Withdrawal requested")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Withdrawals</h1>
        <p className="text-muted-foreground">
          Available balance: {formatCurrency(1240)} · Min{" "}
          {formatCurrency(MIN_WITHDRAWAL_AMOUNT)}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" step="0.01" {...register("amount")} />
        </div>
        <div className="space-y-2">
          <Label>Method</Label>
          <Select
            defaultValue="MPESA"
            onValueChange={(v) =>
              setValue("method", v as WithdrawalInput["method"])
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
        <div className="space-y-2">
          <Label htmlFor="phone">Account / phone</Label>
          <Input
            id="phone"
            placeholder="+255..."
            onChange={(e) => setValue("accountInfo", { phone: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Request withdrawal"}
        </Button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">History</h2>
        </div>
        <div className="divide-y divide-border">
          {history.map((w) => (
            <div key={w.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{formatCurrency(w.amount)}</p>
                <p className="text-sm text-muted-foreground">
                  {w.method} · {w.date}
                </p>
              </div>
              <Badge variant={w.status === "COMPLETED" ? "success" : "secondary"}>
                {w.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
