# Documentation

Architecture and operations notes for Wakamalia.

## Roles & access

| Role | Capabilities |
|------|----------------|
| Guest | Browse public predictions, tipster profiles, leaderboard, search |
| Subscriber | Purchase, follow, social, wallet, notifications |
| Tipster | Predictions, earnings, subscribers, analytics, withdrawals |
| Admin | Users, payments, verifications, reports, settings |

## Security

- Better Auth sessions (HTTP-only cookies) + optional 2FA / email OTP
- RBAC via tRPC `roleProcedure` and server actions
- Zod validation on all inputs
- In-memory rate limiting (`src/lib/rate-limit.ts`) — replace with Redis/Upstash in production
- Prisma parameterized queries (SQL injection protection)
- CSRF via SameSite cookies; XSS mitigated by React escaping + CSP recommended at CDN

## Data model

See `prisma/schema.prisma` for tables:

`users`, `profiles`, `tipsters`, `predictions`, `prediction_images`, `subscriptions`, `payments`, `wallets`, `withdrawals`, `followers`, `comments`, `likes`, `notifications`, `reports`, `reviews`, `verification_requests`, `transactions`, `affiliate_referrals`, `coupons`, plus messages, bookmarks, audit logs, blog, settings.

## Realtime

Pusher channels (stubbed in `src/services/pusher.ts`):

- `user-{id}` — notifications & DMs
- `prediction-{id}` — comment/like updates
- `leaderboard` — ranking refreshes

## Settlement pipeline

1. Tipster publishes prediction with kickoff time
2. Football API polls match results (`src/services/football-api.ts`)
3. Status set to WON / LOST / VOID
4. Tipster stats (ROI, win rate, streak) recalculated
5. AI fraud checks flag anomalous win patterns

## i18n

Locale stored on `User.locale` (`en` | `sw`). UI store (`src/store/ui-store.ts`) holds client preference. Wire `next-intl` when expanding copy coverage.
