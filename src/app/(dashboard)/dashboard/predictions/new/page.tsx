"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { predictionSchema, type PredictionInput } from "@/lib/validations"
import { createPredictionAction } from "@/actions/predictions"
import { SPORTS, ROUTES } from "@/config/site"

export default function NewPredictionPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PredictionInput>({
    // z.coerce fields widen input types; cast keeps react-hook-form happy
    resolver: zodResolver(predictionSchema) as never,
    defaultValues: {
      sport: "FOOTBALL",
      visibility: "FREE",
      confidence: 7,
      odds: 1.85,
      kickoffTime: new Date(Date.now() + 86400000).toISOString(),
    },
  })

  const visibility = watch("visibility")

  async function onSubmit(data: PredictionInput) {
    const result = await createPredictionAction(data)

    if (!result.success) {
      toast.error(result.error ?? "Failed to create prediction")
      return
    }

    toast.success(result.message ?? "Prediction published!")
    router.push(ROUTES.dashboard.tipster)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create prediction</CardTitle>
          <CardDescription>
            Share your pick with free or premium visibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Arsenal value on Asian Handicap -0.5"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Sport</Label>
                <Select
                  defaultValue="FOOTBALL"
                  onValueChange={(v) =>
                    setValue("sport", v as PredictionInput["sport"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="league">League</Label>
                <Input id="league" placeholder="Premier League" {...register("league")} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="homeTeam">Home team</Label>
                <Input id="homeTeam" {...register("homeTeam")} />
                {errors.homeTeam && (
                  <p className="text-xs text-destructive">{errors.homeTeam.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayTeam">Away team</Label>
                <Input id="awayTeam" {...register("awayTeam")} />
                {errors.awayTeam && (
                  <p className="text-xs text-destructive">{errors.awayTeam.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="match">Match label</Label>
              <Input
                id="match"
                placeholder="Arsenal vs Brighton"
                {...register("match")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="prediction">Pick</Label>
                <Input id="prediction" {...register("prediction")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="odds">Odds</Label>
                <Input id="odds" type="number" step="0.01" {...register("odds")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidence">Confidence (1–10)</Label>
                <Input
                  id="confidence"
                  type="number"
                  min={1}
                  max={10}
                  {...register("confidence")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  defaultValue="FREE"
                  onValueChange={(v) =>
                    setValue("visibility", v as PredictionInput["visibility"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">Free</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {visibility === "PREMIUM" && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input id="price" type="number" step="0.01" {...register("price")} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="analysis">Analysis (optional)</Label>
              <Textarea
                id="analysis"
                rows={4}
                placeholder="Share your reasoning…"
                {...register("analysis")}
              />
            </div>

            <input type="hidden" {...register("kickoffTime")} />

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing…" : "Publish prediction"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
