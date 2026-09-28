# FilmDrop — Product Requirements Document (MVP)

> **Status**: Draft
> **Last Updated**: 2026-09-28
> **Scope**: Portfolio project — Stripe test mode, USD only
> **Target**: 3-week build

---

## 1. Problem Statement

Vimeo On Demand shut down September 21, 2026, leaving indie filmmakers without a self-serve TVOD platform. No remaining option combines:

- Self-serve upload (no curation gatekeeping)
- High filmmaker revenue share (85%+)
- Professional streaming quality
- Integrated payments

**FilmDrop fills this gap.**

---

## 2. Target Users

### Primary: Indie Filmmaker
| Attribute | Profile |
|-----------|--------|
| Films | Short films, documentaries, indie features |
| Tech literacy | Medium — comfortable with Vimeo-level UX |
| Pain today | Vimeo dead; Gumroad has no player; MUBI is invite-only |
| Goal | Upload film, set price, get paid |

### Secondary: Indie Film Viewer
| Attribute | Profile |
|-----------|--------|
| Behavior | Willing to pay $4–$12 for curated indie content |
| Device | Desktop 60%, Mobile 40% |
| Discovery | Social share, filmmaker newsletter, Google search |

---

## 3. Goals & Non-Goals

### In Scope (MVP)
- Filmmaker signup + Stripe Connect Express onboarding (test mode)
- Film upload via tus — direct to Cloudflare Stream
- Trailer + thumbnail upload
- Set buy price + optional rent price (USD)
- Film landing page (`/film/[slug]`) with SSR + SEO
- Viewer purchase via Stripe Checkout (test mode)
- Rental option with 48hr expiry
- Gated playback via signed Cloudflare URLs (2hr tokens)
- Filmmaker dashboard: earnings, views, per-film stats
- Email: purchase confirmation + upload ready notification (Resend)
- Free films (price = $0)

### Out of Scope (MVP)
- Real money / live Stripe keys
- Razorpay / UPI / INR payments
- GST, TDS, or any tax compliance
- DRM (Widevine/FairPlay) — later
- Watermarking — later
- Subscription/SVOD model — later
- Web series / multi-episode — later
- Regional language UI — later
- Comments / ratings — later
- Mobile apps — later

---

## 4. User Stories & Acceptance Criteria

### 4.1 Filmmaker: Onboarding

**US-01**: As a filmmaker, I can sign up with email or Google.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-01.1 | Email magic link OR Google OAuth | P0 |
| AC-01.2 | `is_filmmaker = true` set on profile | P0 |
| AC-01.3 | Redirected to Stripe Connect onboarding after signup | P0 |
| AC-01.4 | Dashboard locked until `stripe_onboarded = true` | P0 |

**US-02**: As a filmmaker, I can connect Stripe so I can receive payouts.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-02.1 | "Connect Stripe" → Stripe Express onboarding | P0 |
| AC-02.2 | `stripe_account_id` stored on profile | P0 |
| AC-02.3 | Webhook `account.updated` sets `stripe_onboarded = true` | P0 |
| AC-02.4 | 85% of every sale auto-transfers to filmmaker Stripe | P0 |

---

### 4.2 Filmmaker: Film Upload

**US-03**: As a filmmaker, I can upload a film.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-03.1 | Accepts MP4/MOV, max 2GB | P0 |
| AC-03.2 | tus resumable upload direct to Cloudflare Stream | P0 |
| AC-03.3 | Progress bar shown during upload | P0 |
| AC-03.4 | Status = `processing` immediately after upload | P0 |
| AC-03.5 | CF webhook `stream.video.ready` → status = `published` | P0 |
| AC-03.6 | Email notification when film is live | P1 |

**US-04**: As a filmmaker, I can set metadata and pricing.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-04.1 | Fields: title, tagline, description, genre, duration, year | P0 |
| AC-04.2 | Buy price in USD (or $0 for free) | P0 |
| AC-04.3 | Optional rent price + 48hr expiry | P1 |
| AC-04.4 | Thumbnail upload | P0 |
| AC-04.5 | Trailer upload (separate Cloudflare UID) | P1 |
| AC-04.6 | Slug auto-generated from title, editable | P0 |
| AC-04.7 | Draft saves without publishing | P0 |

---

### 4.3 Viewer: Discovery & Purchase

**US-05**: As a viewer, I can browse and discover films.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-05.1 | Homepage shows recent published films | P0 |
| AC-05.2 | `/film/[slug]` renders with SSR for Google indexing | P0 |
| AC-05.3 | Filter by genre, price range, duration | P1 |
| AC-05.4 | Filmmaker profile at `/filmmaker/[username]` | P1 |
| AC-05.5 | Dynamic OG image + meta description | P1 |

**US-06**: As a viewer, I can buy or rent a film.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-06.1 | "Buy for $X" → Stripe Checkout | P0 |
| AC-06.2 | "Rent for $X" → Stripe Checkout (if filmmaker enabled) | P1 |
| AC-06.3 | After payment: `purchases` row created via webhook | P0 |
| AC-06.4 | Email confirmation sent | P1 |
| AC-06.5 | Rental: `expires_at = NOW() + 48hr` | P1 |

**US-07**: As a viewer, I can watch a film I purchased.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-07.1 | `/watch/[slug]` requires auth + valid purchase | P0 |
| AC-07.2 | No purchase → redirect to `/film/[slug]?buy=true` | P0 |
| AC-07.3 | Valid purchase → 2hr signed Cloudflare URL served | P0 |
| AC-07.4 | Expired rental → redirect to film page | P1 |
| AC-07.5 | Watch session recorded in `watch_sessions` | P1 |

---

### 4.4 Filmmaker: Dashboard

**US-08**: As a filmmaker, I can see my earnings and film performance.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-08.1 | Dashboard shows total revenue, purchases, views | P0 |
| AC-08.2 | Per-film breakdown: views, purchases, revenue | P0 |
| AC-08.3 | Earnings chart (last 30 days) | P1 |
| AC-08.4 | Link to Stripe Express dashboard | P0 |

---

## 5. Payment Flow (Stripe only, test mode)

```
Viewer clicks "Buy for $8"
  → POST /api/stripe/checkout
  → Stripe Checkout Session created
      application_fee_amount = price * 0.15   (platform 15%)
      transfer_data.destination = filmmaker.stripe_account_id  (85% auto)
  → Viewer pays with test card (4242 4242 4242 4242)
  → Webhook: payment_intent.succeeded
  → INSERT INTO purchases
  → Redirect to /watch/[slug]
```

---

## 6. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Video start time (TTFF) | < 3 seconds on broadband |
| Upload max file size | 2 GB |
| Signed URL expiry | 2 hours |
| Stripe webhook processing | < 5 seconds |
| Mobile responsive | Yes |
| HTTPS | Yes — Vercel enforced |

---

## 7. Telemetry (lightweight)

| Event | Trigger |
|-------|--------|
| `film_page_viewed` | `/film/[slug]` load |
| `trailer_played` | Trailer play click |
| `buy_clicked` | Buy CTA click |
| `purchase_completed` | Stripe webhook |
| `watch_started` | Player play |
| `watch_completed` | >= 90% watched |
| `upload_completed` | CF webhook ready |

---

## 8. Open Questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Platform name: FilmDrop confirmed? | Pending |
| Q2 | Upload limit: 2GB OK? | Pending |
| Q3 | Rental duration: filmmaker-configurable or fixed 48hr? | Pending |
| Q4 | Free films: require login or open? | Pending |

---

## 9. Launch Criteria (Portfolio DoD)

- [ ] All P0 ACs passing
- [ ] End-to-end test: upload film → buy with test card → watch
- [ ] Filmmaker dashboard shows earnings
- [ ] Film page has proper OG tags (screenshot for portfolio)
- [ ] Deployed live on Vercel with custom domain
- [ ] README with demo GIF / Loom walkthrough
