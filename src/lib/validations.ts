import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(24)
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
})

export const predictionSchema = z.object({
  title: z.string().min(5).max(120),
  sport: z.enum([
    "FOOTBALL",
    "BASKETBALL",
    "TENNIS",
    "CRICKET",
    "RUGBY",
    "MMA",
    "HORSE_RACING",
    "OTHER",
  ]),
  league: z.string().optional(),
  tournament: z.string().optional(),
  match: z.string().min(3),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  kickoffTime: z.string().datetime().or(z.string().min(1)),
  prediction: z.string().min(2).max(200),
  odds: z.coerce.number().min(1.01).max(1000),
  confidence: z.coerce.number().int().min(1).max(10),
  bookmaker: z.string().optional(),
  bookingCode: z.string().max(64).optional(),
  analysis: z.string().max(5000).optional(),
  tags: z.array(z.string()).max(10).optional(),
  visibility: z.enum(["FREE", "PREMIUM"]),
  price: z.coerce.number().min(0).optional(),
  scheduledAt: z.string().optional().nullable(),
})

/** Fast path: screenshot + booking code, minimal typing */
export const quickPredictionSchema = z.object({
  bookingCode: z
    .string()
    .min(3, "Enter a booking code")
    .max(64, "Booking code is too long"),
  sport: z
    .enum([
      "FOOTBALL",
      "BASKETBALL",
      "TENNIS",
      "CRICKET",
      "RUGBY",
      "MMA",
      "HORSE_RACING",
      "OTHER",
    ])
    .default("FOOTBALL"),
  visibility: z.enum(["FREE", "PREMIUM"]).default("FREE"),
  price: z.coerce.number().min(0).optional(),
  note: z.string().max(500).optional(),
})

export const profileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/),
  bio: z.string().max(500).optional(),
  country: z.string().max(56).optional(),
  website: z.string().url().optional().or(z.literal("")),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
})

export const tipsterPricingSchema = z.object({
  weeklyPrice: z.coerce.number().min(0).max(10000),
  monthlyPrice: z.coerce.number().min(0).max(10000),
})

export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  predictionId: z.string(),
  parentId: z.string().optional(),
})

export const withdrawalSchema = z.object({
  amount: z.coerce.number().min(20),
  method: z.enum([
    "STRIPE",
    "FLUTTERWAVE",
    "PAYSTACK",
    "AZAMPAY",
    "MPESA",
    "BANK_TRANSFER",
  ]),
  accountInfo: z.record(z.string(), z.string()),
})

export const depositSchema = z.object({
  amount: z.coerce.number().min(1).max(100000),
  provider: z.enum([
    "STRIPE",
    "FLUTTERWAVE",
    "PAYSTACK",
    "AZAMPAY",
    "MPESA",
    "BANK_TRANSFER",
  ]),
})

export const searchSchema = z.object({
  q: z.string().optional(),
  sport: z.string().optional(),
  league: z.string().optional(),
  country: z.string().optional(),
  tipster: z.string().optional(),
  visibility: z.enum(["FREE", "PREMIUM", "ALL"]).optional(),
  minWinRate: z.coerce.number().optional(),
  minRoi: z.coerce.number().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
})

export const reviewSchema = z.object({
  tipsterId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  content: z.string().max(1000).optional(),
})

export const reportSchema = z.object({
  targetType: z.enum(["USER", "PREDICTION", "COMMENT"]),
  targetId: z.string(),
  reason: z.string().min(10).max(500),
})

export const newsletterSchema = z.object({
  email: z.string().email(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PredictionInput = z.infer<typeof predictionSchema>
export type QuickPredictionInput = z.infer<typeof quickPredictionSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type SearchInput = z.infer<typeof searchSchema>
