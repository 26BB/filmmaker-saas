# 🎬 FilmDrop — MVP Implementation Plan

> **Status**: Awaiting Approval  
> **Last Updated**: 2026-09-27  
> **Repo**: [26BB/filmmaker-saas](https://github.com/26BB/filmmaker-saas)  
> **Target**: 6-week ship, timed to Vimeo On Demand's September 21, 2026 shutdown

---

## Goal

Build **FilmDrop** — a self-serve TVOD platform where indie filmmakers upload films, set their own price, and keep **85%** of every sale. Platform handles hosting, streaming, payments, and discovery. Zero upfront cost for anyone.

This is a time-sensitive opportunity: Vimeo On Demand shut down **6 days ago**, stranding thousands of filmmakers without a TVOD home. We ship in 6 weeks.

---

## User Review Required

> **IMPORTANT**: Platform name = "FilmDrop" (placeholder). Confirm or choose: `FilmDrop` / `Reelr` / `Shortwave` / `Cineflow` / `Framevault`

> **IMPORTANT**: Content scope for MVP: short films (< 40 min) + documentaries only. Feature films + web series → v2. Confirm?

> **WARNING**: DRM: Full Widevine/FairPlay adds 3–4 weeks. MVP uses Cloudflare signed URLs (2-hour expiry) which stops 95% of casual piracy. Full DRM in v2. OK?

> **IMPORTANT**: Currency: USD + Stripe global for MVP. Razorpay/INR in v2. Confirm?

> **IMPORTANT**: Upload size limit: 2 GB/film cap for MVP. Confirm?

---

## Open Questions

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | Filmmaker can offer Buy + Rent? | YES — filmmaker decides per film |
| 2 | Allow free films? | YES — drives discovery |
| 3 | Filmmaker identity verification? | Stripe KYC handles it |
| 4 | Separate trailer upload? | YES — separate file from main film |
| 5 | Revenue split? | 85/15 confirmed; effective net ~12% after Stripe fees |
| 6 | Default rental duration? | 48 hours (configurable per film) |
| 7 | Auth providers for MVP? | Email + Google OAuth |

---

## Architecture

```
Filmmaker Browser
  |
  |-- [Upload] --> tus direct upload --> Cloudflare Stream
  |                                           |
  |                                    [Webhook] stream.video.ready
  |                                           |
  +-- [Dashboard] <-- Supabase DB <----------+

Viewer Browser
  |
  |-- [Browse] --> /film/[slug] --> Supabase (published films)
  |-- [Buy] --> Stripe Checkout --> Webhook --> purchases table
  +-- [Watch] --> /watch/[slug] --> API signs CF URL --> plays film
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | SSR for SEO-critical film pages |
| DB + Auth | Supabase (PostgreSQL + RLS) | RLS = zero-code access control |
| Video | Cloudflare Stream | Cheapest CDN, native tus, signed URLs |
| Payments | Stripe + Connect Express | Handles filmmaker KYC + automatic payouts |
| Upload client | tus-js-client | Resumable, direct browser→Cloudflare, no server proxy |
| Styling | Tailwind CSS + shadcn/ui | Fast, accessible, consistent |
| Email | Resend | Purchase confirmations, payout alerts |
| Hosting | Vercel | Free tier + edge middleware for access control |
| Type safety | TypeScript strict | Full-stack types via Supabase codegen |

---

## Database Schema

Full migration SQL: `supabase/migrations/001_initial_schema.sql`

**Tables**: `profiles`, `films`, `purchases`, `watch_sessions`  
**RLS**: published films are public read; filmmakers own their films; viewers own their purchases  
See `docs/SCHEMA.md` for full SQL.

---

## Implementation Phases

### Phase 1 — Foundation (Week 1)

**Files created:**
- `apps/web/` — Next.js 15 + Tailwind + shadcn/ui bootstrap
- `supabase/migrations/001_initial_schema.sql` — all tables, enums, RLS, triggers
- `apps/web/middleware.ts` — protects `/dashboard/*`, `/watch/*`
- `apps/web/lib/supabase/{client,server}.ts`
- `apps/web/app/(auth)/login/page.tsx` — email + Google OAuth

**Key code:**
```typescript
// middleware.ts — purchase-gated watch routes
export const config = { matcher: ['/dashboard/:path*', '/watch/:path*'] };
```

---

### Phase 2 — Upload Pipeline (Week 2)

**Files created:**
- `apps/web/app/api/upload/initiate/route.ts`
- `apps/web/app/api/webhooks/cloudflare/route.ts`
- `apps/web/components/upload/UploadDropzone.tsx`
- `apps/web/app/(filmmaker)/upload/page.tsx`
- `apps/web/lib/cloudflare.ts`

**Key code:**
```typescript
// POST /api/upload/initiate
// 1. Verify user is_filmmaker = true
// 2. Reject if fileSizeBytes > 2_000_000_000 (2GB cap)
// 3. Call CF Stream API → get tus URL
// 4. UPDATE films SET cf_video_uid = videoUid
// 5. Return { uploadUrl, videoUid }

// POST /api/webhooks/cloudflare
// stream.video.ready  → UPDATE films SET status = 'published'
// stream.video.errored → UPDATE films SET status = 'error'
```

**Upload flow:**
```
Filmmaker selects file → POST /api/upload/initiate → get tus URL
→ tus-js-client uploads directly to Cloudflare (browser→CF)
→ Progress bar updates in real-time
→ CF webhook fires → film goes live at /film/[slug]
```

---

### Phase 3 — Payments (Week 3)

**Files created:**
- `apps/web/app/api/stripe/connect/create-account/route.ts`
- `apps/web/app/api/stripe/checkout/route.ts`
- `apps/web/app/api/webhooks/stripe/route.ts`
- `apps/web/app/api/stream/signed-url/route.ts`
- `apps/web/app/watch/[slug]/page.tsx`
- `apps/web/lib/stripe.ts`

**Key code:**
```typescript
// POST /api/stripe/checkout — destination charge
{
  payment_intent_data: {
    application_fee_amount: price_cents * 0.15,  // platform 15%
    transfer_data: { destination: filmmaker.stripe_account_id } // 85% auto
  }
}

// POST /api/stream/signed-url
// SELECT purchase WHERE viewer_id = uid
//   AND (expires_at IS NULL OR expires_at > NOW())
// → If valid: CF signed token (2hr expiry)
// → If not: 403
```

---

### Phase 4 — Discovery & SEO (Week 4)

**Files created:**
- `apps/web/app/film/[slug]/page.tsx` — SSR + OG tags + JSON-LD
- `apps/web/app/(marketing)/page.tsx` — homepage
- `apps/web/app/browse/page.tsx` — filters: genre, country, price, duration
- `apps/web/app/filmmaker/[username]/page.tsx`
- `apps/web/app/sitemap.ts`
- `apps/web/components/film/FilmCard.tsx`

**Key code:**
```typescript
// /film/[slug]/page.tsx — generateMetadata for SEO
export async function generateMetadata({ params }) {
  const film = await getFilmBySlug(params.slug);
  return {
    title: `${film.title} — FilmDrop`,
    openGraph: { title: film.title, description: film.tagline, images: [film.thumbnail_url] },
    other: { 'application/ld+json': JSON.stringify(videoObjectSchema(film)) }
  };
}
```

---

### Phase 5 — Analytics & Polish (Week 5)

**Files created:**
- `apps/web/app/(filmmaker)/dashboard/page.tsx`
- `apps/web/app/api/watch-session/route.ts`
- `apps/web/lib/resend.ts` — email templates

**Dashboard features:**
- 30-day revenue chart per film (Recharts)
- Per-film stats: views, purchases, completion rate
- Payout status → Stripe Express dashboard link
- Stripe onboarding CTA if not yet connected

**Watch session tracking:**
- Client calls `POST /api/watch-session` every 30s
- Sets `completed = true` when ≥ 90% watched

**Emails (Resend):**
1. Purchase confirmation → viewer
2. Payout notification → filmmaker

---

### Phase 6 — Launch (Week 6)

**Files created:**
- `apps/web/.env.example`

**Deployment:**
```bash
vercel --prod  # from apps/web/
# Set all env vars in Vercel dashboard
# Update Stripe + CF webhook URLs to prod domain
# Update Supabase Site URL
```

**Launch channels:**
- Reddit: r/filmmakers, r/VideoEditing — "Vimeo is dead, here's the replacement"
- Hacker News: Show HN
- Product Hunt
- Direct DM to Vimeo On Demand refugees (Twitter/X)

---

## File Map

```
filmmaker-saas/
├── apps/web/
│   ├── app/api/
│   │   ├── upload/initiate/route.ts            [NEW Ph2]
│   │   ├── stream/signed-url/route.ts          [NEW Ph3]
│   │   ├── stripe/connect/create-account/route.ts [NEW Ph3]
│   │   ├── stripe/checkout/route.ts            [NEW Ph3]
│   │   ├── webhooks/stripe/route.ts            [NEW Ph3]
│   │   ├── webhooks/cloudflare/route.ts        [NEW Ph2]
│   │   └── watch-session/route.ts              [NEW Ph5]
│   ├── app/(marketing)/page.tsx                [NEW Ph4]
│   ├── app/(auth)/login/page.tsx               [NEW Ph1]
│   ├── app/(filmmaker)/
│   │   ├── dashboard/page.tsx                  [NEW Ph5]
│   │   └── upload/page.tsx                     [NEW Ph2]
│   ├── app/film/[slug]/page.tsx                [NEW Ph4]
│   ├── app/watch/[slug]/page.tsx               [NEW Ph3]
│   ├── app/browse/page.tsx                     [NEW Ph4]
│   ├── app/filmmaker/[username]/page.tsx       [NEW Ph4]
│   ├── app/sitemap.ts                          [NEW Ph4]
│   ├── components/upload/UploadDropzone.tsx    [NEW Ph2]
│   ├── components/film/FilmCard.tsx            [NEW Ph4]
│   ├── lib/supabase/{client,server}.ts         [NEW Ph1]
│   ├── lib/cloudflare.ts                       [NEW Ph2]
│   ├── lib/stripe.ts                           [NEW Ph3]
│   ├── lib/resend.ts                           [NEW Ph5]
│   ├── middleware.ts                           [NEW Ph1]
│   └── .env.example                           [NEW Ph6]
└── supabase/
    └── migrations/001_initial_schema.sql       [NEW Ph1]
```

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|----------|
| Upload strategy | Direct tus browser→Cloudflare | No bytes proxied through Vercel; zero bandwidth cost |
| Payment model | Stripe destination charges | Automatically routes 85% to filmmaker, 15% to platform |
| Access control | Next.js edge middleware + signed URLs | Edge-fast; signed URLs expire in 2hr |
| DRM | Signed URLs only (MVP) | Ships 4 weeks faster; Widevine/FairPlay is significant complexity |
| SSR strategy | Server Components for /film/[slug] | Critical for SEO; Google must crawl film pages |
| Analytics | Supabase watch_sessions | No third-party cost; sufficient for MVP |
| File size limit | 2 GB hard cap | Protects against CF Stream cost spikes |

---

## Unit Economics

| Item | Value |
|------|-------|
| Avg buy price | $8 |
| Platform gross cut (15%) | $1.20 |
| Stripe fee (~3% + $0.30) | ~$0.54 |
| Net per sale | **$0.66** |
| CF Stream storage/film/mo | ~$0.30 |
| CF Stream delivery (20-min film) | ~$0.02/view |
| 100 films × 50 sales/mo | **~$1,000 net/mo** |

---

## Verification Plan

### Automated Tests

```bash
# From apps/web/
npm run type-check   # tsc --noEmit
npm run lint         # ESLint
npm run build        # Production build must succeed
npm run test         # Vitest unit tests
```

Priority test cases:
- `POST /api/stream/signed-url` — 403 with no purchase, 200 with valid purchase, 403 with expired rental
- `POST /api/webhooks/stripe` — rejects invalid signatures, creates purchase rows correctly
- `POST /api/webhooks/cloudflare` — updates film status to `published`
- `isRentalValid()` utility — null expires_at, past, future edge cases

### Manual Verification Checklist

- [ ] Filmmaker: signup → Stripe Connect onboarding → dashboard accessible
- [ ] Upload: film draft → tus progress bar → CF webhook → status = published
- [ ] Film page: `/film/[slug]` loads with OG tags, trailer plays (no auth needed)
- [ ] Viewer: browse → buy via Stripe Checkout → redirected to `/watch/[slug]`
- [ ] Watch page: signed URL generated → CF player loads → film plays
- [ ] Access gate: unauthenticated → redirect to `/film/[slug]`
- [ ] Access gate: no purchase → redirect to `/film/[slug]?buy=true`
- [ ] Rental expiry: after 48h, `/watch/[slug]` returns 403
- [ ] Stripe Connect: filmmaker Express dashboard shows correct 85% earnings
- [ ] SEO: `curl https://filmdrop.io/film/test | grep og:title` returns correct metadata
- [ ] Sitemap: `/sitemap.xml` includes film slugs

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Copyright uploads | DMCA takedown process + ToS + report button on film pages |
| Stripe Connect approval delay | Apply for Connect access on Day 1 (24–48hr turnaround) |
| Storage cost spike (large uploads) | 2 GB/film hard limit in upload initiate endpoint |
| Low filmmaker adoption | Target Vimeo refugees directly on Reddit/Twitter from Day 1 |
| Piracy via URL capture | Signed URLs expire 2hr; per-user watermarking in v2 |
| Vercel cold starts on webhooks | Use `runtime = 'nodejs'` only where required |
