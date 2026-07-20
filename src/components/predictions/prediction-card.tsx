import Link from "next/link"
import { BadgeCheck, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, formatCurrency, getInitials } from "@/lib/utils"
import type { PredictionCard as PredictionCardType } from "@/types"

interface PredictionCardProps {
  prediction: PredictionCardType
  className?: string
}

export function PredictionCard({ prediction, className }: PredictionCardProps) {
  const username = prediction.tipster.profile?.username ?? "tipster"
  const locked =
    prediction.visibility === "PREMIUM" && !prediction.isUnlocked

  return (
    <article
      className={cn(
        "group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href={`/tipsters/${username}`}
          className="flex items-center gap-3"
        >
          <Avatar className="size-9">
            <AvatarImage src={prediction.tipster.image ?? undefined} />
            <AvatarFallback>
              {getInitials(prediction.tipster.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">{username}</span>
              {prediction.tipster.tipster?.isVerified && (
                <BadgeCheck className="size-4 text-primary" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {prediction.sport.replace("_", " ")}
              {prediction.league ? ` · ${prediction.league}` : ""}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {prediction.visibility === "PREMIUM" ? (
            <Badge variant="premium">Premium</Badge>
          ) : (
            <Badge variant="success">Free</Badge>
          )}
          <Badge
            variant={
              prediction.status === "WON"
                ? "success"
                : prediction.status === "LOST"
                  ? "danger"
                  : "secondary"
            }
          >
            {prediction.status}
          </Badge>
        </div>
      </div>

      <Link href={`/predictions/${prediction.id}`} className="block space-y-2">
        <h3 className="text-base font-semibold tracking-tight text-balance group-hover:text-primary">
          {prediction.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {prediction.homeTeam} vs {prediction.awayTeam}
        </p>

        <div className="relative mt-3 overflow-hidden rounded-xl bg-secondary/60 p-4">
          {locked ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <Lock className="size-5 text-muted-foreground" />
              <p className="text-sm font-medium">Premium prediction locked</p>
              <p className="text-xs text-muted-foreground">
                Unlock for {formatCurrency(prediction.price)}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Pick
                </p>
                <p className="font-semibold">{prediction.prediction}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Odds
                </p>
                <p className="font-mono text-lg font-bold">{prediction.odds.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {prediction.likesCount} likes · {prediction.commentsCount} comments
        </span>
        <span>Confidence {prediction.confidence}/10</span>
      </div>
    </article>
  )
}
