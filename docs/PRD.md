# 📋 FilmDrop — Product Requirements Document (MVP)

> **Status**: Draft — Awaiting CEO Review
> **Author**: PM Agent
> **Last Updated**: 2026-09-27
> **Target Launch**: Week 6 (6-week build)

---

## 1. Problem Statement

Vimeo On Demand shut down on **September 21, 2026**, stranding thousands of indie filmmakers without a self-serve TVOD home. No remaining platform combines:
- Self-serve upload (no curation gatekeeping)
- High filmmaker revenue share (≥ 85%)
- Professional streaming quality
- Integrated payments

**FilmDrop fills this exact vacuum.**

---

## 2. Target Users

### Primary: Indie Filmmaker
| Attribute | Profile |
|-----------|--------|
| Demographics | 22–45, English-speaking markets |
| Films | Short films, docs, features (< 2 hrs) |
| Tech literacy | Medium — comfortable with Vimeo-level UX |
| Revenue expectation | $50–$500/mo per film |
| Pain today | Vimeo dead; Gumroad has no player; MUBI is invite-only |

### Secondary: Indie Film Viewer
| Attribute | Profile |
|-----------|--------|
| Demographics | 18–50, niche film enthusiast |
| Behavior | Willing to pay $4–$12 for curated indie content |
| Device | Desktop 60%, Mobile 40% |
| Discovery | Social share, filmmaker newsletter, Google search |

---

## 3. Goals & Non-Goals

### In Scope (MVP)
- Filmmaker signup + Stripe Connect Express onboarding
- Film upload via tus (direct to Cloudflare Stream)
- Trailer + thumbnail upload
- Set buy price + rent price (filmmaker-controlled)
- Film landing page (`/film/[slug]`) with SEO
- Viewer purchase (Stripe Checkout) + rental (48hr expiry)
- Gated playback via signed Cloudflare URLs (2hr tokens)
- Filmmaker dashboard: earnings, views, per-film stats
- Email: purchase confirmation + payout notifications
- Free films (price = $0)

### Out of Scope (MVP)
- DRM (Widevine/FairPlay) — v2
- Watermarking — v2
- Subscription/SVOD model — v2
- Web series / multi-episode — v2
- INR/Razorpay India payments — v2
- Comments / ratings — v2
- Filmmaker analytics beyond earnings + views — v2
- Content moderation tooling — v2 (manual DMCA for MVP)
- Mobile apps — v2

---

## 4. User Stories & Acceptance Criteria

### 4.1 Filmmaker: Onboarding

**US-01**: As a filmmaker, I can sign up with email or Google so I can create an account quickly.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-01.1 | Email signup with magic link OR Google OAuth | P0 |
| AC-01.2 | `is_filmmaker = true` flag set on profile | P0 |
| AC-01.3 | Redirected to Stripe Connect Express onboarding after signup | P0 |
| AC-01.4 | Dashboard locked until `stripe_onboarded = true` | P0 |

**US-02**: As a filmmaker, I can connect my Stripe account so I can receive payouts.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-02.1 | "Connect Stripe" button triggers Stripe Express onboarding flow | P0 |
| AC-02.2 | `stripe_account_id` stored on profile after OAuth redirect | P0 |
| AC-02.3 | Webhook `account.updated` sets `stripe_onboarded = true` | P0 |
| AC-02.4 | 85% of every sale transfers automatically to filmmaker's Stripe | P0 |

---

### 4.2 Filmmaker: Film Upload

**US-03**: As a filmmaker, I can upload a film so viewers can watch it.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-03.1 | Upload form accepts MP4/MOV, max 2GB for MVP | P0 |
| AC-03.2 | Upload uses tus resumable protocol directly to Cloudflare Stream | P0 |
| AC-03.3 | Progress bar shown during upload | P0 |
| AC-03.4 | Film status = `processing` immediately after upload | P0 |
| AC-03.5 | Cloudflare webhook `stream.video.ready` -> status = `published` | P0 |
| AC-03.6 | Filmmaker notified via email when film is live | P1 |
| AC-03.7 | Cloudflare webhook `stream.video.errored` -> status error + email | P1 |

**US-04**: As a filmmaker, I can upload a separate trailer and thumbnail.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-04.1 | Trailer upload: separate Cloudflare Stream UID stored in `cf_trailer_uid` | P1 |
| AC-04.2 | Thumbnail upload: stored URL in `thumbnail_url` | P0 |
| AC-04.3 | Trailer plays free on the public film page | P0 |

**US-05**: As a filmmaker, I can set my film's metadata and pricing.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-05.1 | Form fields: title, tagline, description, genre, duration, year, country | P0 |
| AC-05.2 | Buy price in USD (or $0 for free) | P0 |
| AC-05.3 | Optional rental price in USD with 48hr default expiry | P1 |
| AC-05.4 | Film slug auto-generated from title, editable | P0 |
| AC-05.5 | Draft saves without publishing | P0 |

---

### 4.3 Viewer: Discovery & Purchase

**US-06**: As a viewer, I can browse and discover films.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-06.1 | Homepage shows featured/recent published films | P0 |
| AC-06.2 | `/film/[slug]` renders with SSR for Google indexing | P0 |
| AC-06.3 | Filter by genre, price range (free / paid), duration | P1 |
| AC-06.4 | Filmmaker profile page at `/filmmaker/[username]` | P1 |
| AC-06.5 | Dynamic OG image + meta description for social sharing | P1 |

**US-07**: As a viewer, I can buy or rent a film.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-07.1 | "Buy for $X" button -> Stripe Checkout | P0 |
| AC-07.2 | "Rent for $X" button -> Stripe Checkout (if filmmaker enabled) | P1 |
| AC-07.3 | After payment: `purchases` row created via webhook | P0 |
| AC-07.4 | After payment: email confirmation sent via Resend | P1 |
| AC-07.5 | Rental: `expires_at = NOW() + 48hr` set on purchase row | P1 |

**US-08**: As a viewer, I can watch a film I purchased.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-08.1 | `/watch/[slug]` requires auth + valid purchase | P0 |
| AC-08.2 | Without valid purchase -> redirect to `/film/[slug]?buy=true` | P0 |
| AC-08.3 | With valid purchase -> 2hr signed Cloudflare URL served | P0 |
| AC-08.4 | Signed URL expires; player re-requests if session continues | P1 |
| AC-08.5 | Expired rental -> redirect to film page to re-rent | P1 |
| AC-08.6 | Watch session created in `watch_sessions` table on play | P1 |

---

### 4.4 Filmmaker: Dashboard

**US-09**: As a filmmaker, I can see my earnings and film performance.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-09.1 | Dashboard shows total revenue, total purchases, total views | P0 |
| AC-09.2 | Per-film breakdown: views, purchases, revenue | P0 |
| AC-09.3 | Earnings chart (last 30 days) | P1 |
| AC-09.4 | Completion rate % per film | P2 |
| AC-09.5 | Link to Stripe Express dashboard for payout management | P0 |

---

## 5. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Video start time (TTFF) | < 3 seconds on broadband |
| Upload max file size | 2 GB (MVP) |
| Signed URL expiry | 2 hours |
| Stripe webhook processing | < 5 seconds end-to-end |
| Uptime SLA | 99.5% (Vercel + Cloudflare) |
| Auth token refresh | Supabase default (1hr) |
| HTTPS everywhere | Yes — Vercel enforced |
| GDPR/CCPA | Basic: ToS, Privacy Policy, no PII in logs |

---

## 6. Telemetry & Instrumentation

### Events to Track (client-side)

| Event | Trigger | Properties |
|-------|---------|------------|
| `film_page_viewed` | `/film/[slug]` load | `film_id`, `slug`, `price_cents`, `source` |
| `trailer_played` | Trailer play click | `film_id`, `duration_seconds` |
| `buy_clicked` | "Buy" CTA click | `film_id`, `amount_cents`, `purchase_type` |
| `checkout_started` | Stripe Checkout opened | `film_id`, `session_id` |
| `purchase_completed` | Stripe webhook fired | `film_id`, `amount_cents`, `filmmaker_id` |
| `watch_started` | `/watch/[slug]` player play | `film_id`, `purchase_id` |
| `watch_completed` | >= 90% watched | `film_id`, `watch_duration_seconds` |
| `upload_started` | tus upload begins | `film_id`, `file_size_bytes` |
| `upload_completed` | CF webhook ready | `film_id`, `processing_time_ms` |
| `filmmaker_signed_up` | Profile created + `is_filmmaker=true` | `source` |
| `stripe_connect_completed` | `stripe_onboarded=true` | `filmmaker_id` |

### North Star Funnel

```
Film Page Views -> Trailer Plays -> Buy Clicks -> Checkout Started -> Purchase Completed
    (Discovery)    (Engagement)    (Intent)        (Action)           (Revenue)
```

---

## 7. Open Questions

| # | Question | Owner | Decision |
|---|----------|-------|----------|
| Q1 | Platform name: FilmDrop confirmed? | CEO | Pending |
| Q2 | Revenue split: 85/15 locked? | CEO | Confirmed in PLAN.md |
| Q3 | Upload limit: 2GB for MVP? | Eng | Pending |
| Q4 | Rental duration: filmmaker-configurable or fixed 48hr? | CEO | Pending |
| Q5 | Free films require account signup to watch? | CEO | Pending |
| Q6 | Content moderation: manual DMCA only for MVP? | CEO | Pending |
| Q7 | Minimum withdrawal amount for filmmakers? | CEO | Pending |

---

## 8. Dependencies

| Dependency | Owner | Risk |
|-----------|-------|------|
| Stripe Connect approval | Stripe (24-48hr) | Apply day 1 |
| Cloudflare Stream account | Eng | Low |
| Resend domain verification | Eng | Low |
| Vercel Pro (for edge functions) | CEO | Cost: $20/mo |
| Supabase Pro (for PITR) | CEO | Cost: $25/mo |

---

## 9. Launch Criteria (Definition of Done)

- [ ] All P0 acceptance criteria passing
- [ ] Manual QA checklist in PLAN.md completed
- [ ] Stripe Connect live mode tested with real card
- [ ] 3+ test films uploaded and watchable end-to-end
- [ ] Privacy Policy + Terms of Service live
- [ ] Custom domain (filmdrop.io) live on Vercel
- [ ] Error monitoring (Sentry or Vercel Logs) active
- [ ] At least 5 beta filmmakers onboarded
