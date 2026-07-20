# Wakamalia

Premium social marketplace for sports tipsters — post free or premium predictions, build verified trust, grow subscribers, and get paid.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| API | tRPC, Server Actions |
| Database | PostgreSQL (Neon) + Prisma |
| Auth | Better Auth (email, Google, OTP, 2FA) |
| Payments | Stripe, Flutterwave, Paystack, AzamPay, M-Pesa, bank transfer |
| Storage | Cloudinary |
| Realtime | Pusher |
| Deploy | Vercel + Neon |

## Features

- **Landing** — animated hero, tipsters, trending slips, winners, pricing, FAQ, newsletter
- **Auth** — email/password, Google, OTP verification, password reset, 2FA, sessions
- **Roles** — Guest, Subscriber, Tipster, Admin (RBAC)
- **Predictions** — free/premium, screenshots, odds, confidence, scheduling
- **Social** — follow, like, comment, bookmark, notifications, DMs
- **Monetization** — subscriptions, premium slips, wallet, withdrawals, coupons, affiliates
- **Dashboards** — tipster analytics, subscriber wallet, admin moderation
- **Extras** — leaderboard, search, blog, PWA manifest, EN/SW locales, AI & football API stubs

## Quick start

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Database

Use [Neon](https://neon.tech) or local Postgres via Docker:

```bash
docker compose up -d db
```

Set `DATABASE_URL` in `.env.local`, then:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo content loads even without a live DB connection for UI exploration.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Prisma Studio |

## Project structure

```
src/
  app/           # App Router pages & API routes
  actions/       # Server Actions
  components/    # UI + layout + feature components
  config/        # Site constants
  features/      # Feature modules (extend here)
  hooks/         # React hooks
  lib/           # Auth, utils, validations, tRPC client
  server/        # Prisma + tRPC server
  services/      # Payments, Cloudinary, Pusher, AI, football
  store/         # Zustand stores
  types/         # Shared TypeScript types
prisma/          # Schema & seed
```

## Environment

See [`.env.example`](./.env.example) for all variables:

- `DATABASE_URL` — Neon Postgres
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL`
- Google OAuth, Cloudinary, Pusher
- Stripe / Flutterwave / Paystack / AzamPay / M-Pesa
- Football + AI API keys

## Auth notes

Better Auth routes: `/api/auth/*`

Protected paths (middleware): `/dashboard`, `/admin`, `/wallet`, `/messages`, `/settings`, `/notifications`

## Payments

Provider adapters live in `src/services/payments`. Wire webhook routes under `src/app/api/webhooks/` for each provider before going live. Platform commission defaults to **15%** (`PLATFORM_COMMISSION_RATE`).

## Docker

```bash
docker compose up --build
```

## Production checklist

1. Set strong `BETTER_AUTH_SECRET`
2. Point `DATABASE_URL` at Neon
3. Enable Google OAuth redirect URIs
4. Configure payment webhooks + Cloudinary signed uploads
5. Connect email (Resend) and SMS providers
6. Deploy to Vercel; set all env vars
7. Run `prisma migrate deploy`
8. Enable rate limiting at the edge (Vercel Firewall / Upstash)

## License

Private — all rights reserved.
