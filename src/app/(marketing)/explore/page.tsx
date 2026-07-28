import { PredictionCard } from "@/components/predictions/prediction-card"
import { Badge } from "@/components/ui/badge"
import { listPredictions } from "@/server/data/catalog"
import { SPORTS } from "@/config/site"

export const metadata = {
  title: "Explore Predictions | Wakamalia",
  description: "Browse verified sports predictions from top tipsters.",
}

export default async function ExplorePage() {
  const { items } = await listPredictions({ page: 1, limit: 24 })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore predictions</h1>
          <p className="mt-2 max-w-xl text-muted-foreground text-pretty">
            Discover free and premium picks from verified tipsters across football,
            basketball, and more.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="cursor-default">
            All sports
          </Badge>
          {SPORTS.slice(0, 4).map((sport) => (
            <Badge key={sport.value} variant="outline" className="cursor-default">
              {sport.label}
            </Badge>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No predictions yet. Tipsters can publish their first pick from the dashboard.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      )}
    </div>
  )
}
