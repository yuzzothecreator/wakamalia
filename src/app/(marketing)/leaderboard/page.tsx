"use client"

import Link from "next/link"
import { BadgeCheck, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DEMO_TIPSTERS } from "@/lib/demo-data"
import { formatNumber, formatPercent, getInitials } from "@/lib/utils"

const metrics = [
  { key: "roi", label: "ROI", getValue: (t: (typeof DEMO_TIPSTERS)[0]) => formatPercent(t.roi) },
  {
    key: "winRate",
    label: "Win rate",
    getValue: (t: (typeof DEMO_TIPSTERS)[0]) => `${t.winRate.toFixed(1)}%`,
  },
  {
    key: "followers",
    label: "Followers",
    getValue: (t: (typeof DEMO_TIPSTERS)[0]) => formatNumber(t.followerCount),
  },
] as const

function LeaderboardTable({
  sortKey,
}: {
  sortKey: "roi" | "winRate" | "followers"
}) {
  const sorted = [...DEMO_TIPSTERS].sort((a, b) => {
    if (sortKey === "winRate") return b.winRate - a.winRate
    if (sortKey === "followers") return b.followerCount - a.followerCount
    return b.roi - a.roi
  })

  const metric = metrics.find((m) => m.key === sortKey)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="divide-y divide-border">
        {sorted.map((entry, index) => {
          const username = entry.user.profile?.username ?? "tipster"
          return (
            <Link
              key={entry.id}
              href={`/tipsters/${username}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/50"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {index + 1}
              </span>
              <Avatar className="size-10">
                <AvatarImage src={entry.user.image ?? undefined} />
                <AvatarFallback>{getInitials(entry.user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{entry.user.name}</span>
                  {entry.isVerified && (
                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">@{username}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold">{metric.getValue(entry)}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Trophy className="size-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-2 text-muted-foreground">
          Top-performing tipsters ranked by transparent, verified metrics.
        </p>
      </div>

      <Tabs defaultValue="roi" className="w-full">
        <TabsList className="mb-6 w-full justify-center">
          <TabsTrigger value="roi">ROI</TabsTrigger>
          <TabsTrigger value="winRate">Win rate</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>
        <TabsContent value="roi">
          <LeaderboardTable sortKey="roi" />
        </TabsContent>
        <TabsContent value="winRate">
          <LeaderboardTable sortKey="winRate" />
        </TabsContent>
        <TabsContent value="followers">
          <LeaderboardTable sortKey="followers" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
