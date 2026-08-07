export const APP_NAME = "Wakamalia"
export const APP_TAGLINE = "Turn Your Sports Knowledge Into Real Income"
export const APP_DESCRIPTION =
  "The premium social marketplace for sports tipsters. Post predictions, build trust, grow followers, and earn from subscriptions and premium slips."
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const PLATFORM_COMMISSION_RATE = 0.15
export const MIN_WITHDRAWAL_AMOUNT = 20
export const MAX_UPLOAD_SIZE_MB = 5

export const SPORTS = [
  { value: "FOOTBALL", label: "Football" },
  { value: "BASKETBALL", label: "Basketball" },
  { value: "TENNIS", label: "Tennis" },
  { value: "CRICKET", label: "Cricket" },
  { value: "RUGBY", label: "Rugby" },
  { value: "MMA", label: "MMA" },
  { value: "HORSE_RACING", label: "Horse Racing" },
  { value: "OTHER", label: "Other" },
] as const

export const LOCALES = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
] as const

export const PAYMENT_PROVIDERS = [
  { value: "STRIPE", label: "Stripe", regions: ["global"] },
  { value: "FLUTTERWAVE", label: "Flutterwave", regions: ["africa"] },
  { value: "PAYSTACK", label: "Paystack", regions: ["africa"] },
  { value: "AZAMPAY", label: "AzamPay", regions: ["tanzania"] },
  { value: "MPESA", label: "M-Pesa", regions: ["kenya", "tanzania"] },
  { value: "BANK_TRANSFER", label: "Bank Transfer", regions: ["global"] },
  { value: "WALLET", label: "Wallet", regions: ["global"] },
] as const

export const SUBSCRIPTION_INTERVALS = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
] as const

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  verify: "/verify",
  explore: "/explore",
  tips: "/explore?day=today",
  leaderboard: "/leaderboard",
  search: "/search",
  pricing: "/pricing",
  blog: "/blog",
  predictions: "/predictions",
  tipsters: "/tipsters",
  messages: "/messages",
  notifications: "/notifications",
  wallet: "/wallet",
  settings: "/settings",
  dashboard: {
    tipster: "/dashboard",
    become: "/dashboard/become-tipster",
    create: "/dashboard/predictions/new",
    analytics: "/dashboard/analytics",
    subscribers: "/dashboard/subscribers",
    earnings: "/dashboard/earnings",
    withdrawals: "/dashboard/withdrawals",
  },
  admin: {
    root: "/admin",
    users: "/admin/users",
    predictions: "/admin/predictions",
    payments: "/admin/payments",
    withdrawals: "/admin/withdrawals",
    verifications: "/admin/verifications",
    reports: "/admin/reports",
    settings: "/admin/settings",
  },
} as const

export const RATE_LIMITS = {
  auth: { windowMs: 60_000, max: 10 },
  api: { windowMs: 60_000, max: 100 },
  prediction: { windowMs: 60_000, max: 20 },
  comment: { windowMs: 60_000, max: 30 },
} as const
