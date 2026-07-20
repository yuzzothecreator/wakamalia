"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PLATFORM_COMMISSION_RATE, MIN_WITHDRAWAL_AMOUNT } from "@/config/site"
import { updatePlatformSettingsAction } from "@/actions/admin"

export default function AdminSettingsPage() {
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const result = await updatePlatformSettingsAction({
      commissionRate: Number(form.get("commission")),
      minWithdrawal: Number(form.get("minWithdrawal")),
      maintenanceMode: form.get("maintenance") === "on",
    })
    if (result.success) toast.success(result.message ?? "Settings saved")
    else toast.error(result.error)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform settings</h1>
        <p className="text-muted-foreground">Global configuration for Wakamalia.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commerce</CardTitle>
          <CardDescription>Commission and payout thresholds.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commission">Platform commission (%)</Label>
              <Input
                id="commission"
                name="commission"
                type="number"
                step="0.01"
                defaultValue={PLATFORM_COMMISSION_RATE * 100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minWithdrawal">Minimum withdrawal (USD)</Label>
              <Input
                id="minWithdrawal"
                name="minWithdrawal"
                type="number"
                defaultValue={MIN_WITHDRAWAL_AMOUNT}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="maintenance" className="accent-primary" />
              Maintenance mode
            </label>
            <Button type="submit">Save settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
