import Link from "next/link"
import { BadgeCheck, Compass, Users } from "lucide-react"
import { PredictionCard } from "@/components/predictions/prediction-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { listPredictions, listTipsters } from "@/server/data/catalog"
import { markPredictionsAccess } from "@/server/data/access"
import { getSession } from "@/lib/session"
import { ROUTES, SPORTS } from "@/config/site"
import { cn, formatNumber, formatPercent, getInitials } from "@/lib/utils"

export const metadata = {
  title: "Today's Tips | Wakamalia",
  description: "Scroll today's sports tips from tipsters and discover other picks.",
}

type DayFilter = "today" | "yesterday" | "week" | "all"

interface PageProps {
  searchParams: Promise<{
    day?: string
    sport?: string
  }>
}

const dayOptions: { value: DayFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This week" },
  { value: "all", label: "All tips" },
]

function buildHref(day: string, sport?: string) {
  const params = new URLSearchParams()
  params.set("day", day)
  if (sport && sport !== "ALL") params.set("sport", sport)
  return `/explore?${params.toString()}`
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const params = await searchParams
  const day = (
    ["today", "yesterday", "week", "all"].includes(params.day ?? "")
      ? params.day
      : "today"
  ) as DayFilter
  const sport = params.sport ?? "ALL"

  const [{ items: rawItems, total }, tipsters, session] = await Promise.all([
    listPredictions({ day, sport, page: 1, limit: 40 }),
    listTipsters({ sort: "roi", limit: 8 }),
    getSession(),
  ])
  const items = await markPredictionsAccess(rawItems, session?.user?.id)

  const dayLabel =
    dayOptions.find((option) => option.value === day)?.label ?? "Today"

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Compass className="size-4" />
            Tips feed
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {day === "today" ? "Today's tips" : `${dayLabel} tips`}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground text-pretty">
            Scroll picks from tipsters for the day, check yesterday, or discover
            other people posting now.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={ROUTES.search}>Search tipsters & tips</Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {dayOptions.map((option) => (
          <Link key={option.value} href={buildHref(option.value, sport)}>
            <Badge
              variant={day === option.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-3 py-1.5 text-sm",
                day === option.value && "pointer-events-none"
              )}
            >
              {option.label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href={buildHref(day, "ALL")}>
          <Badge
            variant={sport === "ALL" ? "secondary" : "outline"}
            className="cursor-pointer px-3 py-1.5"
          >
            All sports
          </Badge>
        </Link>
        {SPORTS.slice(0, 6).map((s) => (
          <Link key={s.value} href={buildHref(day, s.value)}>
            <Badge
              variant={sport === s.value ? "secondary" : "outline"}
              className="cursor-pointer px-3 py-1.5"
            >
              {s.label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total} tip{total === 1 ? "" : "s"} · scroll to browse
            </p>
            <Link
              href={ROUTES.leaderboard}
              className="text-sm text-primary hover:underline"
            >
              Top tipsters
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="font-medium">No tips for {dayLabel.toLowerCase()} yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Check yesterday, or browse all tips from other tipsters.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={buildHref("yesterday", sport)}>Yesterday</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={buildHref("all", sport)}>See all tips</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-xl flex-col gap-5 lg:mx-0">
              {items.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <h2 className="font-semibold">Discover tipsters</h2>
            </div>
            <div className="space-y-3">
              {tipsters.map((tipster) => {
                const username = tipster.user.profile?.username ?? "tipster"
                return (
                  <Link
                    key={tipster.id}
                    href={`/tipsters/${username}`}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/60"
                  >
                    <Avatar className="size-10">
                      <AvatarImage src={tipster.user.image ?? undefined} />
                      <AvatarFallback>
                        {getInitials(tipster.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-sm font-medium">
                          {tipster.user.name}
                        </p>
                        {tipster.isVerified && (
                          <BadgeCheck className="size-3.5 shrink-0 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        @{username} · {formatPercent(tipster.roi)} ROI
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(tipster.followerCount)}
                    </span>
                  </Link>
                )
              })}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full" size="sm">
              <Link href={ROUTES.leaderboard}>See more tipsters</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
