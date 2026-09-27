# FilmDrop — Metrics, OKRs & Analytics Plan

> **Quarter**: Q4 2026 (Oct–Dec)
> **Company Base**: India
> **Markets**: India (INR / Razorpay) + International (USD / Stripe)
> **Status**: Draft

---

## 1. North Star Metric

> ### **Films Sold per Week (India INR + International USD)**
> *The single number that captures both supply (films published) and demand (viewers paying) and directly maps to platform health across both markets.*

**Why this metric**:
- A sale means a filmmaker earned money (INR or USD) -> retention
- A sale means a viewer found value -> repeat behavior
- It grows only if both sides of the marketplace are healthy
- It's immune to vanity (unlike page views or signups)
- Tracks both markets without double-counting

**Secondary North Star**: **Indian filmmaker payout rate** (% of Indian filmmakers who received at least one INR payout) — validates the Razorpay Route integration is working and filmmakers are actually earning.

---

## 2. OKRs — Q4 2026 (Launch Quarter)

### Objective 1: Make FilmDrop the go-to TVOD platform for Indian indie filmmakers

| Key Result | Target | Current | Status |
|-----------|--------|---------|--------|
| KR1.1 — Indian filmmaker signups | 80 | 0 | Not started |
| KR1.2 — Indian films published (all languages) | 60 | 0 | Not started |
| KR1.3 — Razorpay bank onboarding completion rate | >= 80% of Indian signups | -- | Not started |
| KR1.4 — Indian filmmaker NPS (survey, n>=10) | >= 50 | -- | Not started |
| KR1.5 — Languages represented at launch | >= 4 (Hindi, Tamil, Malayalam, Marathi) | 0 | Not started |

### Objective 2: Capture global Vimeo On Demand refugees

| Key Result | Target | Current | Status |
|-----------|--------|---------|--------|
| KR2.1 — International filmmaker signups | 120 | 0 | Not started |
| KR2.2 — International films published | 90 | 0 | Not started |
| KR2.3 — Stripe Connect completion rate | >= 80% of intl. signups | -- | Not started |

### Objective 3: Prove viewer willingness to pay in both markets

| Key Result | Target | Current | Status |
|-----------|--------|---------|--------|
| KR3.1 — Total INR purchases | 250 | 0 | Not started |
| KR3.2 — Total USD purchases | 250 | 0 | Not started |
| KR3.3 — INR GMV | Rs.50,000 | Rs.0 | Not started |
| KR3.4 — USD GMV | $2,000 | $0 | Not started |
| KR3.5 — Film page to purchase CVR | >= 5% | -- | Not started |
| KR3.6 — UPI payment success rate | >= 95% | -- | Not started |
| KR3.7 — Repeat purchase rate | >= 15% | -- | Not started |

### Objective 4: Ship MVP on time, legally compliant

| Key Result | Target | Current | Status |
|-----------|--------|---------|--------|
| KR4.1 — Launch in <= 6 weeks | Week 6 | Week 0 | In progress |
| KR4.2 — All P0 ACs shipped | 100% | 0% | Not started |
| KR4.3 — GST registration + GSTIN configured | Done before launch | -- | Not started |
| KR4.4 — TDS 194O deduction verified end-to-end | Working | -- | Not started |
| KR4.5 — Infra cost < Rs.50,000/mo at 150 films | < Rs.50,000 | -- | Not started |

---

## 3. KPI Dashboard

### Supply-Side KPIs (Filmmaker)

| KPI | Formula | Cadence | India Target (M1) | Intl. Target (M1) |
|-----|---------|---------|-------------------|-----------------|
| Filmmaker signups | COUNT by market | Daily | 80 | 120 |
| Payout onboarding rate | onboarded / signups | Weekly | >= 80% (Razorpay) | >= 80% (Stripe) |
| Films published | COUNT(status='published') by market | Daily | 60 | 90 |
| Films per filmmaker | published / signups | Weekly | >= 0.75 | >= 0.75 |
| Upload completion rate | completed / started | Weekly | >= 90% | >= 90% |
| Upload error rate | errors / uploads | Weekly | < 5% | < 5% |
| Filmmaker 30-day retention | active at day 30 | Monthly | >= 40% | >= 40% |
| Languages represented | COUNT(DISTINCT language) | Weekly | >= 4 | >= 3 |

### Demand-Side KPIs (Viewer)

| KPI | Formula | Cadence | India Target (M1) | Intl. Target (M1) |
|-----|---------|---------|-------------------|-----------------|
| Film page views | SUM(film_page_viewed) | Daily | 3,000 | 2,000 |
| Trailer play rate | trailer_played / page_viewed | Weekly | >= 35% | >= 30% |
| Buy click rate | buy_clicked / page_viewed | Weekly | >= 12% | >= 10% |
| Checkout conversion | purchased / checkout_started | Weekly | >= 80% (UPI) | >= 70% (card) |
| Purchases | COUNT(purchases) | Daily | 250 | 250 |
| UPI payment success rate | upi_success / upi_attempted | Daily | >= 95% | N/A |
| Repeat purchase rate | viewers 2+ purchases / all | Monthly | >= 15% | >= 15% |
| Film completion rate | completed / watch_sessions | Weekly | >= 50% | >= 50% |

> Note: UPI checkout conversion expected to be higher than card (80%+ vs 70%) because UPI removes card entry friction.

### Revenue KPIs

| KPI | India | International |
|-----|-------|---------------|
| GMV (M1) | Rs.50,000 | $2,000 |
| Platform revenue 15% (M1) | Rs.7,500 | $300 |
| Net after gateway fees | Rs.6,000 (~12% effective) | $165 (~8.25% effective) |
| Infra cost (M1) | Shared: ~Rs.15,000/mo total | Shared |
| Gross margin | ~60% of platform revenue | ~45% of platform revenue |
| Avg revenue per film | Rs.833 (60 films) | $33 (90 films) |

---

## 4. Funnel Analysis

### Filmmaker Activation Funnel — India

```
Filmmaker Signup (India)
  -> Razorpay Route KYC Started    target: 90% of signups
    -> Razorpay KYC Completed      target: 80% of signups
      -> Film Draft Created        target: 70% of onboarded
        -> Film Published          target: 60% of onboarded
          -> First INR Sale        target: 30% in month 1
```

### Filmmaker Activation Funnel — International

```
Filmmaker Signup (International)
  -> Stripe Connect Started        target: 90% of signups
    -> Stripe Connect Completed    target: 80% of signups
      -> Film Draft Created        target: 70% of onboarded
        -> Film Published          target: 60% of onboarded
          -> First USD Sale        target: 30% in month 1
```

### Viewer Conversion Funnel

```
Film Page View (100%)
  -> Trailer Played                    target: 30-35%
    -> Buy/Rent Clicked               target: 10-12%
      -> Checkout Opened              target: 8%
        -> Purchased (UPI/Card)       target: 5-6% of page views
          -> Watched to completion    target: 50%
            -> Repeat Purchase        target: 15%
```

---

## 5. Unit Economics Model

### India (INR / Razorpay)

| Metric | Value | Notes |
|--------|-------|-------|
| Avg buy price (India) | Rs.199 | Short film; suggested default |
| Avg rent price (India) | Rs.79 | 48hr access |
| Platform gross cut (15%) | Rs.30 (buy) / Rs.12 (rent) | |
| Razorpay fee (~2% + Rs.3) | Rs.7 (buy) | Per transaction |
| TDS 194O deduction (1%) | Rs.1.70 (on filmmaker share) | Remitted to IT dept |
| Net per buy sale (platform) | **~Rs.23** | After Razorpay fees |
| CF Stream cost/view | ~Rs.2 | ~$0.02/view |
| CF Storage/film/mo | ~Rs.25 | ~$0.30/film |

### International (USD / Stripe)

| Metric | Value | Notes |
|--------|-------|-------|
| Avg buy price (global) | $8.00 | |
| Avg rent price (global) | $4.00 | 48hr access |
| Platform gross cut (15%) | $1.20 (buy) | |
| Stripe fee (~3% + $0.30) | $0.54 (buy) | Per transaction |
| Net per buy sale (platform) | **$0.66** | After Stripe fees |

### Scenario Modeling (Combined)

| Scenario | India Films | Intl Films | India GMV | Intl GMV | Platform Net (INR equiv.) |
|----------|------------|-----------|----------|---------|---------------------------|
| Conservative | 30 | 50 | Rs.30,000 | $1,600 | ~Rs.50,000 |
| Base | 60 | 90 | Rs.50,000 | $2,000 | ~Rs.75,000 |
| Optimistic | 200 | 200 | Rs.2,00,000 | $8,000 | ~Rs.3,00,000 |

---

## 6. Analytics Infrastructure

### Event Collection

| Tool | Role | Cost |
|------|------|------|
| Supabase `watch_sessions` | Watch completion, duration | Free (DB) |
| Supabase custom events table | All funnel events with `currency` + `gateway` fields | Free (DB) |
| Vercel Analytics | Page views, Core Web Vitals | Free tier |
| Razorpay Dashboard | INR revenue, UPI success rates, payouts | Included |
| Stripe Dashboard | USD revenue, payouts, disputes | Included |

> NOTE: Avoid third-party analytics (Mixpanel, Amplitude) in MVP. Use Supabase + Vercel Analytics + gateway dashboards.
> Migrate to PostHog self-hosted if volume > 100K events/mo.

### Key Event Properties (India additions)

All events should include:
- `currency`: `INR` or `USD`
- `payment_gateway`: `razorpay` or `stripe`
- `payment_method`: `upi` / `debit_card` / `credit_card` / `netbanking` / `stripe_card`
- `film_language`: `hindi` / `tamil` / `telugu` / `malayalam` / `marathi` / `bengali` / `kannada` / `english` / `other`
- `viewer_country`: ISO country code
- `device_type`: `mobile` / `desktop` / `tablet`

### Reporting Cadence

| Report | Cadence | Audience |
|--------|---------|----------|
| Daily KPI snapshot (India + Intl) | Daily | CEO |
| Weekly funnel review | Monday | CEO + Eng |
| UPI success rate check | Daily (first month) | Eng |
| Monthly OKR check-in | 1st of month | CEO |
| Filmmaker earnings report | Monthly auto-email | Filmmakers |
| GST summary for CA | Monthly | CEO + CA |

---

## 7. Alerts & Anomaly Detection

| Alert | Threshold | Channel |
|-------|-----------|--------|
| Razorpay webhook failure | Any error | Email + Supabase log |
| UPI success rate drops below 90% | Rolling 1hr | Email to Eng |
| Stripe webhook failure | Any error | Email + Supabase log |
| Upload error rate > 10% | Rolling 1hr | Slack/Discord |
| Zero purchases in 24hr | After launch | Email to CEO |
| Cloudflare Stream error spike | > 5 errors/hr | Email |
| Platform INR revenue drops 50% WoW | -- | Dashboard alert |
| TDS deduction mismatch | Any | Email to CEO + CA |

---

## 8. Experimentation Roadmap (Post-Launch)

| Experiment | Hypothesis | Metric | Min Sample | Market |
|-----------|-----------|--------|------------|--------|
| Default INR price nudge (Rs.199 vs. no default) | Suggested price increases avg INR price | avg_buy_price_inr | 200 film pages | India |
| UPI-first vs. Card-first checkout layout | UPI-first increases payment success rate | payment_success_rate | 500 checkouts | India |
| WhatsApp share button prominence | WhatsApp share increases India referral traffic | india_referral_sessions | 1,000 film pages | India |
| Rent CTA A/B position | Rent CTA prominence increases rental rate | rent_clicked / page_view | 1,000 page views | Both |
| Festival laurels on film page | Laurels increase buy CVR | buy_cvr | 500 film pages | Both |
| Email subject line (Hindi vs. English) | Hindi subject line increases open rate for Indian filmmakers | email_open_rate | 200 Indian filmmakers | India |
