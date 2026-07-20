import Link from "next/link"
import { notFound } from "next/navigation"
import { BadgeCheck, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/shared/stat-card"
import { PredictionCard } from "@/components/predictions/prediction-card"
import { DEMO_PREDICTIONS, DEMO_TIPSTERS } from "@/lib/demo-data"
import { formatCurrency, formatNumber, getInitials } from "@/lib/utils"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  return { title: `@${username} | Wakamalia` }
}

export default async function TipsterProfilePage({ params }: PageProps) {
  const { username } = await params
  const tipsterEntry = DEMO_TIPSTERS.find(
    (t) => t.user.profile?.username === username
  )

  if (!tipsterEntry) notFound()

  const user = tipsterEntry.user
  const stats = tipsterEntry
  const predictions = DEMO_PREDICTIONS.filter(
    (p) => p.tipster.profile?.username === username
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent sm:h-40" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="size-24 border-4 border-card">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  {stats.isVerified && (
                    <BadgeCheck className="size-5 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground">@{username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Users className="size-4" />
                Follow
              </Button>
              <Button>
                Subscribe · {formatCurrency(stats.monthlyPrice)}/mo
              </Button>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {user.profile?.bio}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stats.isVerified && <Badge variant="success">Verified</Badge>}
            <Badge variant="secondary">{user.profile?.country}</Badge>
            <Badge variant="outline">
              {formatNumber(stats.followerCount)} followers
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="ROI" value={`${stats.roi}%`} />
        <StatCard title="Win rate" value={`${stats.winRate}%`} />
        <StatCard
          title="Predictions"
          value={String(stats.totalPredictions)}
        />
        <StatCard
          title="Subscribers"
          value={formatNumber(stats.subscriberCount)}
        />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Recent predictions</h2>
        {predictions.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {predictions.map((p) => (
              <PredictionCard key={p.id} prediction={p} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No predictions yet.</p>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link href="/explore" className="text-primary hover:underline">
          Browse more tipsters
        </Link>
      </p>
    </div>
  )
}
