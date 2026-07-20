"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { MailCheck } from "lucide-react"
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
import { otpSchema } from "@/lib/validations"
import { authClient } from "@/lib/auth-client"
import { ROUTES } from "@/config/site"
import type { z } from "zod"

type OtpInput = z.infer<typeof otpSchema>

function VerifyForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
  })

  async function onSubmit(data: OtpInput) {
    if (!email) {
      toast.error("Missing email. Please register again.")
      return
    }

    const result = await authClient.emailOtp.verifyEmail({
      email,
      otp: data.code,
    })

    if (result.error) {
      toast.error(result.error.message ?? "Invalid verification code")
      return
    }

    toast.success("Email verified! You can now sign in.")
  }

  async function resendCode() {
    if (!email) {
      toast.error("Missing email address")
      return
    }

    const result = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    })

    if (result.error) {
      toast.error(result.error.message ?? "Could not resend code")
      return
    }

    toast.success("Verification code resent")
  }

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          {email
            ? `We sent a 6-digit code to ${email}`
            : "Enter the 6-digit code from your email"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification code</Label>
            <Input
              id="code"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="text-center font-mono text-lg tracking-[0.3em]"
              {...register("code")}
            />
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verifying…" : "Verify email"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={resendCode}
          >
            Resend code
          </Button>
          <Link
            href={ROUTES.login}
            className="text-center text-sm text-primary hover:underline"
          >
            Continue to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-card" />}>
      <VerifyForm />
    </Suspense>
  )
}
