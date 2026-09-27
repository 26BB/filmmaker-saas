# 🎬 FilmDrop — Implementation Plan

> **Status**: Awaiting Approval  
> **Last Updated**: 2026-09-27

---

## 🚨 Market Timing

**Vimeo On Demand shut down September 21, 2026** — 6 days ago. Thousands of filmmakers need a new home. This is the single best moment to launch this product.

---

## Goal

Build a self-serve TVOD platform where indie filmmakers upload films, set their own price, and keep 85% of every sale. Platform handles hosting, streaming, payments, and discovery. Zero upfront cost for filmmakers.

---

## User Review Required

> **IMPORTANT**: Platform Name = "FilmDrop" (placeholder). Confirm or choose: FilmDrop / Reelr / Shortwave / Cineflow / Framevault

> **IMPORTANT**: Content scope for MVP:
> - Short films (< 40 min) — recommended start
> - Documentaries
> - Feature films — add v2
> - Web series — add v2

> **WARNING**: DRM: Full Widevine/FairPlay = 3-4 extra weeks. Signed URLs (ship in 4 weeks) protect 95% of casual piracy. Recommend signed URLs for MVP.

> **IMPORTANT**: Global USD + Stripe for MVP. Razorpay/INR India support in v2.

---

## Open Questions

1. Rental vs Purchase? Filmmaker chooses both (recommended)
2. Free films? YES — drives discovery
3. Filmmaker verification? Stripe KYC handles it
4. Trailer upload? Filmmaker uploads separate trailer
5. Revenue split? 85/15 confirmed. Effective margin ~12% after Stripe fees.

---

## Architecture

```
Filmmaker Browser
  |
  |-- [Upload] --> tus direct upload --> Cloudflare Stream
  |                                           |
  |                                    [Webhook] processing done
  |                                           |
  +-- [Dashboard] <-- Supabase DB <----------+

Viewer Browser
  |
  |-- [Browse] --> /film/[slug] --> Supabase (published films)
  |-- [Buy] --> Stripe Checkout --> Webhook --> purchases table
  +-- [Watch] --> /watch/[slug] --> API signs CF URL --> plays film
```

---

## Database Schema

See [SCHEMA.md](./SCHEMA.md) for full table definitions.

**Core tables**:
- `profiles` — extends auth.users, stores Stripe Connect ID
- `films` — metadata + Cloudflare video UIDs + pricing
- `purchases` — payment records, rental expiry, payout tracking
- `watch_sessions` — analytics: views, completion rates

**RLS Policies**:
- Anyone: read published films
- Filmmaker: CRUD own films, read own film purchases
- Viewer: read own purchases, create watch_sessions

---

## User Flows

### Filmmaker Flow
```
Signup --> is_filmmaker = true --> Stripe Connect onboarding
  --> Dashboard --> Upload Film
    --> Film details form (title, price, genre...)
    --> Upload via tus (browser --> Cloudflare direct)
    --> Upload trailer + thumbnail
    --> Cloudflare webhook --> status: published
    --> Film live at /film/[slug]
    --> Earnings dashboard: views, revenue, payouts
```

### Viewer Flow
```
Browse /film/[slug] --> Watch trailer (free)
  --> "Buy for $8" or "Rent for $4"
    --> Stripe Checkout (destination charge, 15% app fee)
    --> Webhook --> purchases row created
    --> Redirect to /watch/[slug]
    --> Middleware: purchase verified --> signed CF URL served
    --> Film plays in embedded player
```

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 App Router | SSR for SEO-critical film pages |
| DB + Auth | Supabase | RLS = zero-code access control |
| Video | Cloudflare Stream | Cheapest, native tus upload, resumable |
| Payments | Stripe + Connect Express | Industry standard, handles filmmaker KYC |
| Upload | tus-js-client | Resumable, no server proxying |
| Styling | Tailwind + shadcn/ui | Fast, accessible |
| Email | Resend | Purchase confirmations, payout alerts |
| Hosting | Vercel | Free tier + edge functions |

---

## Implementation Phases

### Phase 1 — Foundation (Week 1)
- [ ] Next.js 15 project init + Tailwind + shadcn/ui
- [ ] Supabase project + schema migrations
- [ ] Auth: email + Google OAuth
- [ ] Middleware: protected routes
- [ ] Basic layout, nav, landing page

### Phase 2 — Upload Pipeline (Week 2)
- [ ] Cloudflare Stream account + API keys
- [ ] `POST /api/upload/initiate` endpoint
- [ ] Frontend: tus-js-client upload component with progress bar
- [ ] Cloudflare webhook handler
- [ ] Film details form + draft management

### Phase 3 — Payments (Week 3)
- [ ] Stripe Connect Express filmmaker onboarding
- [ ] Stripe Checkout: destination charges
- [ ] Stripe webhook: payment_intent.succeeded --> purchases table
- [ ] `POST /api/stream/signed-url` — gated playback
- [ ] `/watch/[slug]` page with Cloudflare player

### Phase 4 — Discovery & SEO (Week 4)
- [ ] `/film/[slug]` public page
- [ ] Homepage: featured films grid
- [ ] Browse: filter by genre, country, duration, price
- [ ] Dynamic sitemap.xml + OG images
- [ ] Filmmaker profile: `/filmmaker/[username]`

### Phase 5 — Analytics & Polish (Week 5)
- [ ] Filmmaker dashboard: earnings chart, per-film stats
- [ ] Watch session tracking
- [ ] Resend emails: purchase + payout notifications
- [ ] Mobile responsive polish
- [ ] Error states + loading skeletons

### Phase 6 — Launch (Week 6)
- [ ] Deploy to Vercel production + custom domain
- [ ] Beta: 10 indie filmmakers from Reddit
- [ ] Outreach to displaced Vimeo On Demand users
- [ ] Product Hunt + Hacker News Show HN

---

## Unit Economics

| Item | Value |
|------|-------|
| Avg film buy price | $8 |
| Our gross cut (15%) | $1.20 |
| Stripe fee (~3%) | $0.54 |
| Net per sale | **$0.66** |
| CF Stream (20min film) | ~$0.02/view |
| CF Storage per film/mo | ~$0.30 |
| 100 films x 50 sales/mo | **~$1,000/mo net** |

---

## Competitive Gap

| Platform | Split | Self-Serve Upload | Status |
|----------|-------|-------------------|--------|
| **FilmDrop** | 85/15 | YES | Building |
| Vimeo On Demand | 90/10 | YES | **DEAD (Sept 2026)** |
| MUBI | Licensing | NO (curated) | Active |
| Fandor | Licensing | NO (curated) | Active |
| Gumroad | 90/10 | YES but no player | Active |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Copyright uploads | DMCA takedown + ToS + reporting |
| Stripe Connect approval | Apply early (24-48hr) |
| Storage cost spike | 2GB/film upload limit for MVP |
| Low adoption | Target Vimeo refugees directly |
| Piracy via URL sharing | Signed URLs expire 2hr; watermarking v2 |

---

## Verification Plan

### Automated Tests
```bash
npm run test        # Vitest unit tests
npm run type-check  # TypeScript
npm run lint        # ESLint
```

### Manual Checklist
- [ ] Filmmaker: signup, Stripe onboarding, upload film
- [ ] Film: draft -> processing -> published
- [ ] Viewer: browse, purchase via Stripe
- [ ] After purchase: /watch/[slug] plays film
- [ ] Without purchase: /watch/[slug] redirects to film page
- [ ] Stripe Connect: filmmaker receives 85%
- [ ] Rental: access expires after 48 hours
- [ ] Film page SEO renders correctly
