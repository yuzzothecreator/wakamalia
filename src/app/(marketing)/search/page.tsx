"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PredictionCard } from "@/components/predictions/prediction-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DEMO_PREDICTIONS, DEMO_TIPSTERS } from "@/lib/demo-data"
import { getInitials } from "@/lib/utils"

export default function SearchPage() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { predictions: [], tipsters: [] }

    const predictions = DEMO_PREDICTIONS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.match.toLowerCase().includes(q) ||
        p.league?.toLowerCase().includes(q) ||
        p.tipster.profile?.username.toLowerCase().includes(q)
    )

    const tipsters = DEMO_TIPSTERS.filter(
      (t) =>
        t.user.name.toLowerCase().includes(q) ||
        t.user.profile?.username.toLowerCase().includes(q)
    )

    return { predictions, tipsters }
  }, [query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-xl">
        <h1 className="mb-4 text-center text-3xl font-bold tracking-tight">Search</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search predictions, tipsters, leagues…"
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      {query.trim() === "" ? (
        <p className="text-center text-muted-foreground">
          Start typing to search predictions and tipsters.
        </p>
      ) : (
        <div className="space-y-10">
          {results.tipsters.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Tipsters</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.tipsters.map((t) => {
                  const username = t.user.profile?.username ?? "tipster"
                  return (
                    <Link
                      key={t.id}
                      href={`/tipsters/${username}`}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
                    >
                      <Avatar>
                        <AvatarImage src={t.user.image ?? undefined} />
                        <AvatarFallback>{getInitials(t.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{t.user.name}</p>
                        <p className="text-sm text-muted-foreground">@{username}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {results.predictions.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Predictions</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.predictions.map((p) => (
                  <PredictionCard key={p.id} prediction={p} />
                ))}
              </div>
            </section>
          )}

          {results.predictions.length === 0 && results.tipsters.length === 0 && (
            <p className="text-center text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  )
}
