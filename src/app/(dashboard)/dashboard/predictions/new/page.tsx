"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ImagePlus, Ticket } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  predictionSchema,
  type PredictionInput,
} from "@/lib/validations"
import {
  createPredictionAction,
  createQuickPredictionAction,
} from "@/actions/predictions"
import { SPORTS, ROUTES } from "@/config/site"

export default function NewPredictionPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"quick" | "detailed">("quick")
  const [bookingCode, setBookingCode] = useState("")
  const [note, setNote] = useState("")
  const [sport, setSport] = useState<PredictionInput["sport"]>("FOOTBALL")
  const [visibility, setVisibility] = useState<"FREE" | "PREMIUM">("FREE")
  const [price, setPrice] = useState("4.99")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [quickSubmitting, setQuickSubmitting] = useState(false)

  useEffect(() => {
    if (!screenshot) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(screenshot)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [screenshot])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PredictionInput>({
    resolver: zodResolver(predictionSchema) as never,
    defaultValues: {
      sport: "FOOTBALL",
      visibility: "FREE",
      confidence: 7,
      odds: 1.85,
      kickoffTime: new Date(Date.now() + 86400000).toISOString(),
    },
  })

  const detailedVisibility = watch("visibility")

  async function onDetailedSubmit(data: PredictionInput) {
    const result = await createPredictionAction(data)
    if (!result.success) {
      toast.error(result.error ?? "Failed to create prediction")
      return
    }
    toast.success(result.message ?? "Prediction published!")
    router.push(ROUTES.dashboard.tipster)
  }

  async function onQuickSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!screenshot) {
      toast.error("Add a bet slip screenshot")
      return
    }
    if (bookingCode.trim().length < 3) {
      toast.error("Enter a booking code")
      return
    }

    setQuickSubmitting(true)
    try {
      const formData = new FormData()
      formData.set("bookingCode", bookingCode.trim())
      formData.set("sport", sport)
      formData.set("visibility", visibility)
      if (visibility === "PREMIUM") formData.set("price", price)
      if (note.trim()) formData.set("note", note.trim())
      formData.set("screenshot", screenshot)

      const result = await createQuickPredictionAction(formData)
      if (!result.success) {
        toast.error(result.error ?? "Failed to publish")
        return
      }
      toast.success(result.message ?? "Quick pick published!")
      router.push(ROUTES.dashboard.tipster)
    } finally {
      setQuickSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create prediction</CardTitle>
          <CardDescription>
            Short on time? Post a screenshot and booking code. Or fill the full slip when you can.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "quick" | "detailed")}
            className="w-full"
          >
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="quick" className="gap-2">
                <Ticket className="size-4" />
                Quick post
              </TabsTrigger>
              <TabsTrigger value="detailed">Full details</TabsTrigger>
            </TabsList>

            <TabsContent value="quick">
              <form onSubmit={onQuickSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="bookingCode">Booking code</Label>
                  <Input
                    id="bookingCode"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                    placeholder="e.g. 8K2M9P"
                    className="font-mono uppercase tracking-wide"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Subscribers can load this code at their bookmaker.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Bet slip screenshot</Label>
                  <label
                    htmlFor="screenshot"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-10 text-center transition-colors hover:bg-secondary/70"
                  >
                    {previewUrl ? (
                      <div className="relative h-48 w-full overflow-hidden rounded-xl">
                        <Image
                          src={previewUrl}
                          alt="Screenshot preview"
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <>
                        <ImagePlus className="size-8 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Upload screenshot</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            JPG, PNG, or WEBP up to 5MB
                          </p>
                        </div>
                      </>
                    )}
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={(e) =>
                        setScreenshot(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Sport</Label>
                    <Select
                      value={sport}
                      onValueChange={(v) =>
                        setSport(v as PredictionInput["sport"])
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
                    <Label>Visibility</Label>
                    <Select
                      value={visibility}
                      onValueChange={(v) =>
                        setVisibility(v as "FREE" | "PREMIUM")
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
                </div>

                {visibility === "PREMIUM" && (
                  <div className="space-y-2">
                    <Label htmlFor="quickPrice">Price (USD)</Label>
                    <Input
                      id="quickPrice"
                      type="number"
                      step="0.01"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="note">Short note (optional)</Label>
                  <Textarea
                    id="note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="One line of context if you want…"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={quickSubmitting}>
                    {quickSubmitting ? "Publishing…" : "Publish screenshot"}
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
            </TabsContent>

            <TabsContent value="detailed">
              <form onSubmit={handleSubmit(onDetailedSubmit)} className="space-y-5">
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

                <div className="space-y-2">
                  <Label htmlFor="bookingCodeDetailed">Booking code (optional)</Label>
                  <Input
                    id="bookingCodeDetailed"
                    placeholder="e.g. 8K2M9P"
                    className="font-mono uppercase"
                    {...register("bookingCode")}
                  />
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
                  {detailedVisibility === "PREMIUM" && (
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
