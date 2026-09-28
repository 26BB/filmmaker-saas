# FilmDrop — Metrics & OKRs

> **Scope**: Portfolio project — Stripe test mode
> **Note**: All targets are aspirational for when the product goes live with real users

---

## 1. North Star Metric

> ### **Films Sold per Week**
> *Captures both supply (films published) and demand (viewers paying). Grows only if both sides of the marketplace are healthy.*

---

## 2. OKRs — Portfolio Build Sprint

### Objective 1: Ship a working, impressive MVP in 3 weeks

| Key Result | Target |
|-----------|--------|
| KR1.1 — All P0 acceptance criteria passing | 100% |
| KR1.2 — End-to-end flow works: upload → buy (test card) → watch | Done |
| KR1.3 — Deployed live on Vercel with custom domain | Done |
| KR1.4 — Demo video / Loom walkthrough recorded | Done |
| KR1.5 — Zero TypeScript errors, lint passing | Done |

### Objective 2: Make it portfolio-impressive

| Key Result | Target |
|-----------|--------|
| KR2.1 — Film page has correct SSR + OG tags (screenshot for CV) | Done |
| KR2.2 — Filmmaker dashboard shows real chart (Recharts) | Done |
| KR2.3 — Video TTFF < 3 seconds on broadband | Done |
| KR2.4 — Mobile responsive (looks good on phone) | Done |

### Objective 3: Aspirational — when live with real users

| Key Result | Target (Month 1) |
|-----------|------------------|
| KR3.1 — Filmmaker signups | 200 |
| KR3.2 — Films published | 150 |
| KR3.3 — Total purchases | 500 |
| KR3.4 — GMV | $4,000 |
| KR3.5 — Platform revenue (15%) | $600 |
| KR3.6 — Film page → purchase CVR | >= 5% |
| KR3.7 — Repeat purchase rate | >= 15% |

---

## 3. KPI Dashboard (when live)

### Supply-Side (Filmmaker)

| KPI | Formula | Target (M1) |
|-----|---------|-------------|
| Filmmaker signups | COUNT(is_filmmaker=true) | 200 |
| Stripe onboarding rate | stripe_onboarded / signups | >= 80% |
| Films published | COUNT(status='published') | 150 |
| Upload completion rate | completed / started | >= 90% |
| Filmmaker 30-day retention | active at day 30 | >= 40% |

### Demand-Side (Viewer)

| KPI | Formula | Target (M1) |
|-----|---------|-------------|
| Film page views | SUM(film_page_viewed) | 5,000 |
| Trailer play rate | trailer_played / page_viewed | >= 30% |
| Buy click rate | buy_clicked / page_viewed | >= 10% |
| Checkout conversion | purchased / checkout_started | >= 70% |
| Purchases | COUNT(purchases) | 500 |
| Film completion rate | completed / watch_sessions | >= 50% |
| Repeat purchase rate | viewers 2+ purchases / all | >= 15% |

### Revenue

| KPI | Target (M1) |
|-----|-------------|
| GMV | $4,000 |
| Platform revenue (15%) | $600 |
| Net after Stripe fees | ~$330 |
| Infra cost | < $200 |
| Gross margin | >= 60% |

---

## 4. Funnel

### Filmmaker Activation
```
Signup
  → Stripe Connect Started     target: 90%
    → Stripe Connect Done      target: 80%
      → Film Draft Created     target: 70%
        → Film Published       target: 60%
          → First Sale         target: 30% in month 1
```

### Viewer Conversion
```
Film Page View (100%)
  → Trailer Played             target: 30%
    → Buy Clicked              target: 10%
      → Checkout Opened        target: 8%
        → Purchased            target: 5% of page views
          → Watched 90%+       target: 50%
            → Repeat Purchase  target: 15%
```

---

## 5. Unit Economics

| Metric | Value |
|--------|-------|
| Avg buy price | $8.00 |
| Avg rent price | $4.00 |
| Platform cut (15%) | $1.20 (buy) |
| Stripe fee (~3% + $0.30) | $0.54 (buy) |
| **Net per buy sale** | **$0.66** |
| CF Stream cost/view | ~$0.02 |
| CF Storage/film/mo | ~$0.30 |
| Break-even | ~100 sales/mo |

### Scenarios

| Scenario | Films | Sales/film/mo | GMV | Platform Net |
|----------|-------|--------------|-----|--------------|
| Conservative | 50 | 10 | $4,000 | $264 |
| Base | 150 | 20 | $24,000 | $1,584 |
| Optimistic | 400 | 30 | $96,000 | $6,336 |

---

## 6. Analytics Stack (MVP)

| Tool | Role | Cost |
|------|------|------|
| Supabase `watch_sessions` | Watch completion + duration | Free |
| Vercel Analytics | Page views, Web Vitals | Free tier |
| Stripe Dashboard | Revenue, payouts | Included |

> Keep it simple. No Mixpanel, no Amplitude for MVP.
> Add PostHog self-hosted post-internship if needed.

---

## 7. Experiments to Run (post-launch)

| Experiment | Hypothesis | Metric |
|-----------|-----------|--------|
| Default price nudge ($8 vs no default) | Suggestion increases avg price | avg_buy_price |
| Rent CTA position A/B | Prominence increases rental rate | rent_clicked / page_view |
| Festival laurels on film page | Laurels increase buy CVR 20%+ | buy_cvr |
| Guest checkout vs. auth-required | Auth gate causes 30%+ drop-off | checkout_cvr |
