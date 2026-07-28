import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { BadgeCheck, Clock, Heart, MessageCircle, Share2, Ticket } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UnlockPredictionButton } from "@/components/predictions/unlock-prediction-button"
import { getPredictionById } from "@/server/data/catalog"
import { canAccessPrediction } from "@/server/data/access"
import { getSession } from "@/lib/session"
import { getInitials } from "@/lib/utils"
import { CountdownDisplay } from "./countdown-display"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const prediction = await getPredictionById(id)
  return {
    title: prediction ? `${prediction.title} | Wakamalia` : "Prediction | Wakamalia",
  }
}

export default async function PredictionDetailPage({ params }: PageProps) {
  const { id } = await params
  const prediction = await getPredictionById(id)

  if (!prediction) notFound()

  const session = await getSession()
  const unlocked =
    prediction.visibility === "FREE" ||
    (await canAccessPrediction(prediction.id, session?.user?.id))

  const username = prediction.tipster.profile?.username ?? "tipster"
  const locked = prediction.visibility === "PREMIUM" && !unlocked
  const screenshot = prediction.images?.[0]
  const isQuickPost = Boolean(prediction.bookingCode || screenshot)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{prediction.sport.replace("_", " ")}</Badge>
        {prediction.league && <Badge variant="outline">{prediction.league}</Badge>}
        {prediction.bookingCode && !locked && (
          <Badge variant="outline" className="font-mono">
            <Ticket className="mr-1 size-3" />
            {prediction.bookingCode}
          </Badge>
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
        {prediction.visibility === "PREMIUM" && (
          <Badge variant="premium">Premium</Badge>
        )}
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-balance">
        {prediction.title}
      </h1>
      {!isQuickPost && (
        <p className="mt-2 text-lg text-muted-foreground">
          {prediction.homeTeam} vs {prediction.awayTeam}
        </p>
      )}

      {!isQuickPost && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          Kickoff:{" "}
          <CountdownDisplay kickoff={prediction.kickoffTime} />
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">
            {isQuickPost ? "Bet slip" : "Prediction slip"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {locked ? (
            <UnlockPredictionButton
              predictionId={prediction.id}
              price={prediction.price}
            />
          ) : (
            <>
              {prediction.bookingCode && (
                <div className="rounded-xl border border-border bg-secondary/40 p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Booking code
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-wider">
                    {prediction.bookingCode}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Load this code in your bookmaker app to copy the slip.
                  </p>
                </div>
              )}

              {screenshot && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary/40">
                  <Image
                    src={screenshot.url}
                    alt={screenshot.alt ?? "Bet slip screenshot"}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              )}

              {!isQuickPost && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Pick</p>
                    <p className="text-lg font-semibold">{prediction.prediction}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Odds</p>
                    <p className="font-mono text-lg font-bold">
                      {prediction.odds.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Confidence</p>
                    <p className="text-lg font-semibold">{prediction.confidence}/10</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button variant="outline" size="sm">
          <Heart className="size-4" />
          {prediction.likesCount}
        </Button>
        <Button variant="outline" size="sm">
          <MessageCircle className="size-4" />
          {prediction.commentsCount}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="size-4" />
          Share
        </Button>
      </div>

      <Card className="mt-8">
        <CardContent className="flex items-center gap-4 p-5">
          <Link href={`/tipsters/${username}`}>
            <Avatar className="size-12">
              <AvatarImage src={prediction.tipster.image ?? undefined} />
              <AvatarFallback>{getInitials(prediction.tipster.name)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link
              href={`/tipsters/${username}`}
              className="flex items-center gap-1.5 font-semibold hover:text-primary"
            >
              {prediction.tipster.name}
              {prediction.tipster.tipster?.isVerified && (
                <BadgeCheck className="size-4 text-primary" />
              )}
            </Link>
            <p className="text-sm text-muted-foreground">
              ROI {prediction.tipster.tipster?.roi}% · Win rate{" "}
              {prediction.tipster.tipster?.winRate}%
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/tipsters/${username}`}>View profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
