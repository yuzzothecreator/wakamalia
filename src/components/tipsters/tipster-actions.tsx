"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleFollowAction } from "@/actions/social"
import { subscribeToTipsterAction } from "@/actions/subscriptions"
import { formatCurrency } from "@/lib/utils"
import { ROUTES } from "@/config/site"

export function TipsterActions({
  tipsterUserId,
  weeklyPrice,
  monthlyPrice,
  initialFollowing,
  initialSubscribed,
  isOwner,
}: {
  tipsterUserId: string
  weeklyPrice: number
  monthlyPrice: number
  initialFollowing: boolean
  initialSubscribed: boolean
  isOwner: boolean
}) {
  const router = useRouter()
  const [following, setFollowing] = useState(initialFollowing)
  const [subscribed, setSubscribed] = useState(initialSubscribed)
  const [busy, setBusy] = useState<"follow" | "week" | "month" | null>(null)

  if (isOwner) {
    return (
      <Button asChild variant="outline">
        <a href={ROUTES.dashboard.tipster}>Your dashboard</a>
      </Button>
    )
  }

  async function onFollow() {
    setBusy("follow")
    const result = await toggleFollowAction(tipsterUserId)
    setBusy(null)
    if (!result.success) {
      toast.error(result.error ?? "Could not follow")
      if (result.error?.toLowerCase().includes("log in")) {
        router.push(ROUTES.login)
      }
      return
    }
    setFollowing(result.data?.following ?? !following)
    toast.success(result.message)
    router.refresh()
  }

  async function onSubscribe(interval: "WEEKLY" | "MONTHLY") {
    setBusy(interval === "WEEKLY" ? "week" : "month")
    const result = await subscribeToTipsterAction({ tipsterId: tipsterUserId, interval })
    setBusy(null)
    if (!result.success) {
      toast.error(result.error ?? "Subscription failed")
      if (result.error?.toLowerCase().includes("log in")) {
        router.push(ROUTES.login)
      } else if (result.error?.toLowerCase().includes("wallet")) {
        router.push(ROUTES.wallet)
      }
      return
    }
    setSubscribed(true)
    toast.success(result.message ?? "Subscribed!")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={following ? "secondary" : "outline"}
          onClick={onFollow}
          disabled={busy !== null}
        >
          <Users className="size-4" />
          {busy === "follow" ? "…" : following ? "Following" : "Follow"}
        </Button>
        {subscribed ? (
          <Button variant="secondary" disabled>
            Subscribed
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => onSubscribe("WEEKLY")}
              disabled={busy !== null || weeklyPrice <= 0}
            >
              {busy === "week"
                ? "…"
                : `Week · ${formatCurrency(weeklyPrice)}`}
            </Button>
            <Button
              onClick={() => onSubscribe("MONTHLY")}
              disabled={busy !== null || monthlyPrice <= 0}
            >
              {busy === "month"
                ? "…"
                : `Subscribe · ${formatCurrency(monthlyPrice)}/mo`}
            </Button>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Paid from your wallet balance
      </p>
    </div>
  )
}
