"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { BadgeCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { becomeTipsterAction } from "@/actions/tipster"
import {
  becomeTipsterSchema,
  type BecomeTipsterInput,
} from "@/lib/validations"
import { ROUTES } from "@/config/site"

export function BecomeTipsterForm({
  defaultBio = "",
  defaultCountry = "",
}: {
  defaultBio?: string
  defaultCountry?: string
}) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BecomeTipsterInput>({
    resolver: zodResolver(becomeTipsterSchema) as never,
    defaultValues: {
      bio: defaultBio,
      country: defaultCountry,
      weeklyPrice: 9.99,
      monthlyPrice: 29.99,
      acceptTerms: false,
    },
  })

  const acceptTerms = watch("acceptTerms")

  async function onSubmit(data: BecomeTipsterInput) {
    const result = await becomeTipsterAction(data)
    if (!result.success) {
      toast.error(result.error ?? "Could not become a tipster")
      return
    }
    toast.success(result.message ?? "You are now a tipster!")
    router.push(ROUTES.dashboard.create)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Your tipster profile
          </CardTitle>
          <CardDescription>
            Set a short bio and subscription prices. You can change these later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              placeholder="Premier League specialist. Transparent ROI."
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="Tanzania" {...register("country")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weeklyPrice">Weekly price (USD)</Label>
              <Input
                id="weeklyPrice"
                type="number"
                step="0.01"
                min={0}
                {...register("weeklyPrice")}
              />
              {errors.weeklyPrice && (
                <p className="text-xs text-destructive">
                  {errors.weeklyPrice.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyPrice">Monthly price (USD)</Label>
              <Input
                id="monthlyPrice"
                type="number"
                step="0.01"
                min={1}
                {...register("monthlyPrice")}
              />
              {errors.monthlyPrice && (
                <p className="text-xs text-destructive">
                  {errors.monthlyPrice.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              Post free tips and premium slips with booking codes or full details
            </li>
            <li className="flex gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              Earn from subscriptions and unlocks (platform fee 15%)
            </li>
            <li className="flex gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              Build verified ROI from settled predictions
            </li>
          </ul>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-border"
              checked={acceptTerms}
              onChange={(e) => setValue("acceptTerms", e.target.checked)}
            />
            <span>
              I will post honest tips, settle results fairly, and follow Wakamalia
              creator guidelines.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Activating…" : "Become a tipster"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
