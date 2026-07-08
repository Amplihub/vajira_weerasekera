# Vajira Weerasekera — Next.js Rebuild

Migration of the Replit MVP (`../Vajira-Weerasekera`) to Next.js + Supabase + BetterAuth + Vercel.

## Stack

| Area | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Styling | Tailwind v4 + shadcn/ui (base-ui) |
| DB | Supabase Postgres via Drizzle ORM (postgres-js) |
| Auth | BetterAuth + Google OAuth, admin email allowlist |
| Storage | Supabase Storage |
| Email | Resend |
| AI | OpenAI gpt-4o (360 summaries) |
| Forms | GoHighLevel iframe embeds + webhook |

## Done (foundation + unblocked backend)

- ✅ Full DB schema ported — 19 tables (`src/db/schema.ts` + `src/db/auth-schema.ts`)
- ✅ Lazy Drizzle client (`src/db/index.ts`)
- ✅ BetterAuth + Google OAuth + allowlist (`src/lib/auth.ts`, `auth-client.ts`, guard, proxy)
- ✅ Data layer ported 1:1 (`src/lib/queries.ts`)
- ✅ OpenAI logic — `generateSummaryDraft`, `generatePersonalClarityMap` (`src/lib/openai.ts`)
- ✅ Email send + audit logging (`src/lib/email.ts`)
- ✅ 360 aggregation logic (`src/lib/feedback.ts`)
- ✅ Token helpers (`src/lib/tokens.ts`)
- ✅ Supabase Storage helper (`src/lib/storage-bucket.ts`)
- ✅ GHL webhook — secret-verified, idempotent (`src/app/api/webhooks/ghl/route.ts`)
- ✅ Admin login + dashboard shell
- ✅ Typecheck + production build green

## API layer — tRPC (done)

Pattern mirrors the reference monorepo (`ecommerce-template`): `@trpc/server` v11 + `@trpc/tanstack-react-query` + TanStack Query v5 + superjson, single-app (no tenant/Prisma/audit/plans).

- `src/server/trpc/` — context (BetterAuth session), `publicProcedure`/`protectedProcedure`/`adminProcedure`
- `src/lib/trpc/` — `client.tsx` (`useTRPC`), `server.tsx` (RSC prefetch + `createCaller`), `query-client.ts`
- `src/app/api/trpc/[trpc]/route.ts`
- Routers: `insights`, `applications` (form_submissions + convert), `coaching` (clients + sessions), `cycles` (full 360 admin), `feedback` (public token survey), `emailLogs`, `clarityMap`
- Security: admin allowlist gate on every admin proc; public 360 procs gated by unguessable single-use tokens, validated for existence/expiry/state; respondent tokens never returned to clients
- SEO/config: `next.config.ts` (301 veritashumanedge→/human-edge, Supabase image domain, turbopack root), `robots.ts`, `sitemap.ts`
- 360 email templates ported (`src/lib/email-templates.ts`); onboarding/nomination templates auto-seed

## Not done (blocked)

- ⛔ Public pages (11) — **blocked on Figma edit access** (redesign)
- ⛔ Admin module UIs (Applications, CRM, Insights, 360 Cycles, Email Log) — fold into redesign, wire to tRPC
- ⛔ 360 public pages (onboarding, nominate, survey, self) — wire to `feedback.*` procs
- ⛔ Streaming summary route handler (`streamSummaryDraft`) — optional UX
- ⛔ DB push to Supabase — **blocked on Supabase `DATABASE_URL`**
- ⛔ Live run / auth + webhook end-to-end test — blocked on env
- ⛔ Tests (feedback aggregation, tokens) — optional, non-blocking

## Setup (when env available)

1. `cp .env.example .env.local` and fill:
   - `DATABASE_URL` (Supabase → Connect → ORM string, port 6543)
   - `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), `BETTER_AUTH_URL`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (redirect: `<url>/api/auth/callback/google`)
   - `ADMIN_EMAILS` (comma-separated)
   - Supabase Storage, Resend, OpenAI, `GHL_WEBHOOK_SECRET`
2. `npm run db:push` — creates all tables in Supabase
3. `npm run dev`

## Open questions for agency

- GHL payload field names → adjust `mapPayload` in the webhook once a real sample exists
- Plaud (transcript/AI on session notes): keep or drop? (schema + openai support retained for now)
