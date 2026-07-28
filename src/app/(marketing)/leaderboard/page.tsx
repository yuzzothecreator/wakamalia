"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BadgeCheck, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNumber, formatPercent, getInitials } from "@/lib/utils"
import type { LeaderboardEntry } from "@/types"

type MetricKey = "roi" | "winRate" | "followers"

function formatMetric(entry: LeaderboardEntry, key: MetricKey) {
  if (key === "winRate") return `${entry.metric.toFixed(1)}%`
  if (key === "followers") return formatNumber(entry.metric)
  return formatPercent(entry.metric)
}

function LeaderboardTable({
  entries,
  sortKey,
}: {
  entries: LeaderboardEntry[]
  sortKey: MetricKey
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="divide-y divide-border">
        {entries.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted-foreground">
            No tipsters ranked yet.
          </p>
        ) : (
          entries.map((entry) => {
            const username = entry.tipster.profile?.username ?? "tipster"
            return (
              <Link
                key={`${entry.rank}-${entry.tipster.id}`}
                href={`/tipsters/${username}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/50"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    entry.rank === 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {entry.rank}
                </span>
                <Avatar className="size-10">
                  <AvatarImage src={entry.tipster.image ?? undefined} />
                  <AvatarFallback>{getInitials(entry.tipster.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{entry.tipster.name}</span>
                    {entry.tipster.tipster?.isVerified && (
                      <BadgeCheck className="size-4 shrink-0 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold">
                    {formatMetric(entry, sortKey)}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.metricLabel}</p>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const [metric, setMetric] = useState<MetricKey>("roi")
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/leaderboard?metric=${metric}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setEntries(data.items ?? [])
      })
      .catch(() => {
        if (!cancelled) setEntries([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [metric])

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

      <Tabs
        value={metric}
        onValueChange={(value) => setMetric(value as MetricKey)}
        className="w-full"
      >
        <TabsList className="mb-6 w-full justify-center">
          <TabsTrigger value="roi">ROI</TabsTrigger>
          <TabsTrigger value="winRate">Win rate</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>
        <TabsContent value={metric}>
          {loading ? (
            <p className="py-10 text-center text-muted-foreground">Loading rankings…</p>
          ) : (
            <LeaderboardTable entries={entries} sortKey={metric} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
