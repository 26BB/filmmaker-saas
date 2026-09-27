# FilmDrop — Product Requirements Document (MVP)

> **Status**: Draft — Awaiting CEO Review
> **Author**: PM Agent
> **Last Updated**: 2026-09-27
> **Company Base**: India (Pune/Mumbai/Bengaluru)
> **Target Launch**: Week 6 (6-week build)

---

## 1. Problem Statement

Vimeo On Demand shut down on **September 21, 2026**, stranding thousands of indie filmmakers globally without a self-serve TVOD home. India specifically has an underserved gap:

- **Indian indie cinema** (Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Kannada) has no dedicated self-serve TVOD platform with INR pricing
- **Vimeo On Demand** never supported INR or Indian payment methods (UPI/NetBanking)
- **International platforms** (Gumroad, etc.) have no video player and charge in USD — high friction for Indian viewers
- **OTT giants** (Netflix, Prime, Hotstar) only license established content — zero opportunity for indie filmmakers

**FilmDrop fills this vacuum** — built in India, designed for both the Indian indie film market and global distribution.

---

## 2. Company & Legal Context

| Item | Detail |
|------|--------|
| Company base | India (registered as Pvt Ltd or LLP) |
| Primary market | India + English-speaking global markets |
| Regulatory | GST registration required; TDS Section 194O compliance |
| Currency | INR (primary, India) + USD (international) |
| Payment gateway | Razorpay (India) + Stripe (international) |
| Banking | Indian bank account for Razorpay settlements |
| Exchange rate assumption | ~83 INR/USD (floating) |

---

## 3. Target Users

### Primary: Indie Filmmaker — India
| Attribute | Profile |
|-----------|--------|
| Geography | India: Mumbai, Pune, Chennai, Kolkata, Bengaluru, Kochi |
| Languages | Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Kannada, English |
| Films | Short films, documentaries, indie features, festival films |
| Tech literacy | Medium — comfortable with YouTube/Instagram creator tools |
| Revenue expectation | Rs.5,000–Rs.50,000/mo per film |
| Pain today | No INR-native TVOD; OTTs won't touch indie content; festival-only distribution |
| Discovery channels | Instagram Reels, YouTube, WhatsApp film groups, MAMI/IFFK/BIFF circuit |

### Secondary: Indie Filmmaker — International
| Attribute | Profile |
|-----------|--------|
| Geography | US, UK, EU, Canada, Australia |
| Films | Displaced Vimeo On Demand users post-Sept 2026 |
| Revenue expectation | $50–$500/mo per film |
| Pain today | Vimeo On Demand dead; Gumroad has no player |

### Tertiary: Indie Film Viewer — India
| Attribute | Profile |
|-----------|--------|
| Demographics | 18–40, urban India, English + regional language literate |
| Behavior | Pays for OTT subscriptions; willing to pay per-film for niche content |
| Payment method | UPI (preferred), Debit/Credit Card, NetBanking |
| Price sensitivity | High — INR pricing critical; Rs.150–Rs.400 buy / Rs.50–Rs.100 rent |
| Device | Mobile-first (75%), Desktop 25% |
| Discovery | Instagram, YouTube, filmmaker newsletters, word-of-mouth |

### Quaternary: Indie Film Viewer — International
| Attribute | Profile |
|-----------|--------|
| Demographics | 18–50, niche film enthusiast, global |
| Payment method | Credit card (Stripe) |
| Price point | $4–$12 USD per film |

---

## 4. Goals & Non-Goals

### In Scope (MVP)
- Filmmaker signup + payout onboarding:
  - India: Razorpay Route (bank account + KYC)
  - International: Stripe Connect Express
- Film upload via tus (direct to Cloudflare Stream)
- Trailer + thumbnail upload
- Dual-currency pricing: INR (for Indian filmmakers) + USD (for international)
- Film landing page (`/film/[slug]`) with SSR + SEO
- Viewer purchase:
  - India: Razorpay Checkout (UPI, Cards, NetBanking)
  - International: Stripe Checkout
- Rental option (48hr expiry)
- Gated playback via signed Cloudflare URLs (2hr tokens)
- Filmmaker dashboard: earnings (INR + USD), views, per-film stats
- GST-compliant invoice generation for Indian purchases (18% GST on digital services)
- TDS deduction on filmmaker payouts (Sec 194O, 1% TDS for registered; 5% for unregistered)
- Email: purchase confirmation + payout notifications (via Resend)
- Free films (price = Rs.0 / $0)
- Mobile-responsive UI (critical for India audience)

### Out of Scope (MVP)
- DRM (Widevine/FairPlay) — v2
- Watermarking — v2
- Subscription/SVOD model — v2
- Web series / multi-episode — v2
- Regional language UI (Hindi, Tamil, etc.) — v2 (English-only UI for MVP)
- Comments / ratings — v2
- Advanced analytics beyond earnings + views — v2
- Automated content moderation — v2 (manual DMCA/DMCA-India for MVP)
- Mobile apps (Android/iOS) — v2
- UPI Autopay / recurring subscriptions — v2

---

## 5. User Stories & Acceptance Criteria

### 5.1 Filmmaker: Onboarding

**US-01**: As a filmmaker, I can sign up with email or Google so I can create an account quickly.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-01.1 | Email signup with magic link OR Google OAuth | P0 |
| AC-01.2 | `is_filmmaker = true` flag set on profile | P0 |
| AC-01.3 | Filmmaker selects currency: INR (India) or USD (International) during onboarding | P0 |
| AC-01.4 | INR filmmakers -> Razorpay Route KYC flow | P0 |
| AC-01.5 | USD filmmakers -> Stripe Connect Express flow | P0 |
| AC-01.6 | Dashboard locked until payout onboarding complete | P0 |

**US-02a**: As an Indian filmmaker, I can connect my bank account via Razorpay so I can receive INR payouts.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-02a.1 | "Connect Bank Account" -> Razorpay Route onboarding | P0 |
| AC-02a.2 | PAN + bank account details collected via Razorpay KYC | P0 |
| AC-02a.3 | `razorpay_account_id` stored on profile | P0 |
| AC-02a.4 | 85% of every INR sale transfers to filmmaker bank; 15% stays on platform | P0 |
| AC-02a.5 | TDS (1%) deducted from filmmaker payout and tracked in `purchases` table | P0 |

**US-02b**: As an international filmmaker, I can connect Stripe so I can receive USD payouts.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-02b.1 | "Connect Stripe" -> Stripe Connect Express onboarding | P0 |
| AC-02b.2 | `stripe_account_id` stored on profile | P0 |
| AC-02b.3 | 85% of every USD sale auto-transfers to filmmaker Stripe account | P0 |

---

### 5.2 Filmmaker: Film Upload & Pricing

**US-03**: As a filmmaker, I can upload a film so viewers can watch it.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-03.1 | Upload accepts MP4/MOV, max 2GB for MVP | P0 |
| AC-03.2 | Upload uses tus resumable protocol directly to Cloudflare Stream | P0 |
| AC-03.3 | Progress bar shown during upload | P0 |
| AC-03.4 | Film status = `processing` immediately after upload | P0 |
| AC-03.5 | Cloudflare webhook `stream.video.ready` -> status = `published` | P0 |
| AC-03.6 | Filmmaker notified via email when film is live | P1 |

**US-04**: As a filmmaker, I can set INR or USD pricing for my film.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-04.1 | INR filmmaker: sets price in Rupees (e.g., Rs.199 buy / Rs.79 rent) | P0 |
| AC-04.2 | USD filmmaker: sets price in Dollars (e.g., $8 buy / $4 rent) | P0 |
| AC-04.3 | Viewer sees price in their currency (INR for India, USD for others) | P1 |
| AC-04.4 | Buy price = Rs.0 / $0 = free film | P0 |
| AC-04.5 | Optional rental price with 48hr default expiry | P1 |
| AC-04.6 | Slug auto-generated from title, editable | P0 |
| AC-04.7 | Draft saves without publishing | P0 |

---

### 5.3 Viewer: Discovery & Purchase

**US-05**: As a viewer, I can browse and discover films.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-05.1 | Homepage shows featured/recent published films | P0 |
| AC-05.2 | `/film/[slug]` renders with SSR for Google indexing | P0 |
| AC-05.3 | Filter by genre, language, price range (free/paid), duration | P1 |
| AC-05.4 | Language filter: Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, English, Other | P1 |
| AC-05.5 | Filmmaker profile page at `/filmmaker/[username]` | P1 |
| AC-05.6 | Dynamic OG image + meta description for social sharing | P1 |

**US-06**: As an Indian viewer, I can buy or rent using UPI or card in INR.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-06.1 | "Buy for Rs.X" -> Razorpay Checkout | P0 |
| AC-06.2 | Razorpay Checkout offers: UPI, Debit Card, Credit Card, NetBanking | P0 |
| AC-06.3 | "Rent for Rs.X" -> Razorpay Checkout (if filmmaker enabled) | P1 |
| AC-06.4 | After payment: `purchases` row created via Razorpay webhook | P0 |
| AC-06.5 | GST-compliant invoice/receipt auto-generated (18% GST included) | P0 |
| AC-06.6 | After payment: email confirmation with receipt + watch link | P1 |
| AC-06.7 | Rental: `expires_at = NOW() + 48hr` | P1 |

**US-07**: As an international viewer, I can buy or rent using card in USD.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-07.1 | "Buy for $X" -> Stripe Checkout | P0 |
| AC-07.2 | "Rent for $X" -> Stripe Checkout (if filmmaker enabled) | P1 |
| AC-07.3 | After payment: `purchases` row created via Stripe webhook | P0 |
| AC-07.4 | Email confirmation sent | P1 |

**US-08**: As a viewer, I can watch a film I purchased.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-08.1 | `/watch/[slug]` requires auth + valid purchase | P0 |
| AC-08.2 | Without valid purchase -> redirect to `/film/[slug]?buy=true` | P0 |
| AC-08.3 | With valid purchase -> 2hr signed Cloudflare URL served | P0 |
| AC-08.4 | Player works on mobile browsers (iOS Safari + Android Chrome) | P0 |
| AC-08.5 | Expired rental -> redirect to film page to re-rent | P1 |
| AC-08.6 | Watch session created in `watch_sessions` table on play | P1 |

---

### 5.4 Filmmaker: Dashboard

**US-09**: As a filmmaker, I can see my earnings and film performance.

| # | Acceptance Criterion | Priority |
|---|---------------------|----------|
| AC-09.1 | Dashboard shows total revenue (in filmmaker's currency), purchases, views | P0 |
| AC-09.2 | Indian filmmakers see: gross earnings, TDS deducted, net payout | P0 |
| AC-09.3 | Per-film breakdown: views, purchases, revenue | P0 |
| AC-09.4 | Earnings chart (last 30 days) | P1 |
| AC-09.5 | TDS certificate download (Form 16A equivalent) — v2 | P2 |
| AC-09.6 | Link to Razorpay dashboard (INR) or Stripe Express (USD) for payout management | P0 |

---

## 6. Payment Architecture (Dual Gateway)

```
Viewer in India
  -> Razorpay Checkout (UPI / Card / NetBanking)
  -> Razorpay Webhook: payment.captured
  -> purchases row created
  -> Razorpay Route: split 85% to filmmaker bank, 15% retained
  -> TDS 1% deducted from filmmaker share
  -> GST invoice generated

Viewer outside India
  -> Stripe Checkout
  -> Stripe Webhook: payment_intent.succeeded
  -> purchases row created
  -> Stripe Connect: destination charge, 15% app fee
  -> Filmmaker receives 85% in their Stripe account
```

**Detection logic**: Viewer's country detected via IP geolocation on film page load.
- India IP -> show INR price + Razorpay button
- Non-India IP -> show USD price + Stripe button
- Filmmaker can override and show both

---

## 7. Tax & Compliance (India)

| Item | Rule | Implementation |
|------|------|----------------|
| GST on digital services | 18% GST on all sales to Indian buyers | Included in displayed price (GST-inclusive pricing) |
| TDS Section 194O | 1% TDS on e-commerce payout to registered PAN; 5% without PAN | Deduct from filmmaker payout, remit to IT dept monthly |
| GST Registration | Required if turnover > Rs.20L/yr | Register from Day 1 (expected to cross threshold) |
| Invoice requirement | GST invoice for every transaction | Auto-generate on purchase_completed event |
| Form 26AS | TDS reflected in filmmaker's Form 26AS via Razorpay | Razorpay handles TDS filing |

> **NOTE**: Consult a CA before launch for GST + TDS setup. Razorpay Route handles TDS deduction automatically if configured.

---

## 8. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Video start time (TTFF) — India | < 4 seconds on 4G mobile |
| Video start time (TTFF) — broadband | < 3 seconds |
| Upload max file size | 2 GB (MVP) |
| Signed URL expiry | 2 hours |
| Razorpay webhook processing | < 5 seconds |
| Stripe webhook processing | < 5 seconds |
| Mobile responsiveness | Required — India is 75% mobile |
| Uptime SLA | 99.5% (Vercel + Cloudflare) |
| Cloudflare PoP | Mumbai + Chennai (low latency for India) |
| Supabase region | ap-southeast-1 (Singapore — closest to India) |
| HTTPS everywhere | Yes — Vercel enforced |
| Data residency | No PII stored outside Supabase (SG); review for DPDPA 2023 compliance |

> **DPDPA 2023**: India's Digital Personal Data Protection Act. MVP compliance: Privacy Policy, consent on signup, data deletion on request.

---

## 9. Telemetry & Instrumentation

### Events to Track

| Event | Trigger | Properties |
|-------|---------|------------|
| `film_page_viewed` | `/film/[slug]` load | `film_id`, `slug`, `price_inr`, `price_usd`, `viewer_country`, `source` |
| `trailer_played` | Trailer play click | `film_id`, `duration_seconds`, `viewer_country` |
| `buy_clicked` | "Buy" CTA click | `film_id`, `amount`, `currency`, `payment_gateway` |
| `checkout_started` | Checkout opened | `film_id`, `gateway` (razorpay/stripe) |
| `purchase_completed` | Webhook fired | `film_id`, `amount_inr`, `amount_usd`, `gateway`, `payment_method` (upi/card/netbanking) |
| `watch_started` | Player play | `film_id`, `purchase_id`, `device_type` |
| `watch_completed` | >= 90% watched | `film_id`, `watch_duration_seconds` |
| `upload_started` | tus upload begins | `film_id`, `file_size_bytes` |
| `filmmaker_signed_up` | Profile created | `currency`, `source` |
| `payout_onboarding_completed` | Razorpay/Stripe KYC done | `filmmaker_id`, `gateway` |

### Key Segmentation Dimensions
- `viewer_country`: India vs. International
- `payment_method`: UPI / debit_card / credit_card / netbanking / stripe_card
- `film_language`: Hindi / Tamil / Telugu / Malayalam / Marathi / Bengali / English / Other
- `device_type`: mobile / desktop / tablet

---

## 10. Open Questions

| # | Question | Owner | Decision |
|---|----------|-------|----------|
| Q1 | Platform name: FilmDrop confirmed? | CEO | Pending |
| Q2 | Revenue split: 85/15 locked for both INR and USD? | CEO | Confirmed |
| Q3 | Upload limit: 2GB for MVP? | Eng | Pending |
| Q4 | Rental duration: filmmaker-configurable or fixed 48hr? | CEO | Pending |
| Q5 | Free films: require account signup to watch, or open? | CEO | Pending |
| Q6 | GST pricing: inclusive or exclusive display to viewer? | CEO + CA | Pending |
| Q7 | TDS: confirm Razorpay Route auto-handles 194O deduction? | CA + Razorpay | Pending |
| Q8 | DPDPA compliance: minimal (Privacy Policy only) for MVP? | CEO + legal | Pending |
| Q9 | INR filmmaker payout: minimum threshold? (Razorpay default: Rs.100) | CEO | Pending |
| Q10 | Content scope: Hindi-belt films only or all Indian regional languages at launch? | CEO | Pending |

---

## 11. Dependencies

| Dependency | Owner | Risk |
|-----------|-------|------|
| Razorpay Route account approval | Razorpay (2–5 days) | Apply Day 1 |
| Stripe Connect account | Stripe (24–48hr) | Apply Day 1 |
| GST registration | CA / CEO | 3–7 days if not already done |
| GSTIN to configure on Razorpay | CEO + CA | Block for invoice generation |
| Cloudflare Stream account | Eng | Low |
| Resend domain + SPF/DKIM | Eng | Low |
| Vercel Pro | CEO | Cost: $20/mo (~Rs.1,660) |
| Supabase Pro (Singapore region) | CEO | Cost: $25/mo (~Rs.2,075) |

---

## 12. Launch Criteria (Definition of Done)

- [ ] All P0 acceptance criteria passing
- [ ] Razorpay + Stripe end-to-end payment tested (real money, real UPI)
- [ ] GST invoice generated correctly on test purchase
- [ ] TDS deduction verified with Razorpay Route
- [ ] 3+ test films uploaded and watchable end-to-end (mobile + desktop)
- [ ] Privacy Policy + Terms of Service live (DPDPA-aware)
- [ ] Custom domain (filmdrop.io or filmdrop.in) live on Vercel
- [ ] Error monitoring active (Sentry or Vercel Logs)
- [ ] At least 5 beta filmmakers onboarded (min 2 Indian regional language films)
