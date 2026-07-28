"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { unlockPredictionAction } from "@/actions/subscriptions"
import { formatCurrency } from "@/lib/utils"
import { ROUTES } from "@/config/site"

export function UnlockPredictionButton({
  predictionId,
  price,
}: {
  predictionId: string
  price: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onUnlock() {
    setLoading(true)
    const result = await unlockPredictionAction(predictionId)
    setLoading(false)

    if (!result.success) {
      toast.error(result.error ?? "Unlock failed")
      if (result.error?.toLowerCase().includes("log in")) {
        router.push(ROUTES.login)
      } else if (result.error?.toLowerCase().includes("wallet")) {
        router.push(ROUTES.wallet)
      }
      return
    }

    toast.success(result.message ?? "Unlocked!")
    router.refresh()
  }

  return (
    <div className="rounded-xl bg-secondary/60 p-8 text-center">
      <Lock className="mx-auto size-6 text-muted-foreground" />
      <p className="mt-3 font-medium">Premium content locked</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Unlock for {formatCurrency(price)} from your wallet, or subscribe to this tipster.
      </p>
      <Button className="mt-4" onClick={onUnlock} disabled={loading}>
        {loading ? "Unlocking…" : `Unlock · ${formatCurrency(price)}`}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Need funds?{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => router.push(ROUTES.wallet)}
        >
          Top up wallet
        </button>
      </p>
    </div>
  )
}
