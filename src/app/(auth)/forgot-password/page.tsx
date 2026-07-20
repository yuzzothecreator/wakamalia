"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { forgotPasswordSchema } from "@/lib/validations"
import { requestPasswordReset } from "@/lib/auth-client"
import { ROUTES } from "@/config/site"
import type { z } from "zod"

type ForgotInput = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotInput) {
    const result = await requestPasswordReset({
      email: data.email,
      redirectTo: `${window.location.origin}/login`,
    })

    if (result.error) {
      toast.error(result.error.message ?? "Could not send reset email")
      return
    }

    toast.success("Reset link sent if the email exists in our system.")
  }

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a secure reset link.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          {isSubmitSuccessful && (
            <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
              Check your inbox for the reset link. It may take a minute to arrive.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
          <Link
            href={ROUTES.login}
            className="text-center text-sm text-primary hover:underline"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
