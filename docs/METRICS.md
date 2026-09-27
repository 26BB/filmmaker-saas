# FilmDrop - Metrics, OKRs & Analytics Plan

> **Quarter**: Q4 2026 (Oct-Dec)
> **Status**: Draft

---

## 1. North Star Metric

> ### **Films Sold per Week**
> *The single number that captures both supply (films published) and demand (viewers paying) and directly maps to platform health.*

**Why this metric**:
- A sale means a filmmaker earned money -> retention
- A sale means a viewer found value -> repeat behavior
- It grows only if both sides of the marketplace are healthy
- It's immune to vanity (unlike page views or signups)

---

## 2. OKRs - Q4 2026 (Launch Quarter)

### Objective 1: Establish FilmDrop as the go-to TVOD platform for indie filmmakers

| Key Result | Target | Current | Status |
|-----------|--------|---------|--------|
| KR1.1 - Films published on platform | 150 | 0 | Not started |
| KR1.2 - Filmmaker signups | 200 | 0 | Not started |
| KR1.3 - Stripe Connect completed by filmmakers | 80% of signups | -- | Not started |
| KR1.4 - Filmmaker NPS (survey, n>=20) | >= 50 | -- | Not started |

### Objective 2: Prove viewer willingness to pay

| Key Result | Target | Current | Status |
|-----------|--------|---------|--------|
| KR2.1 - Total purchases | 500 | 0 | Not started |
| KR2.2 - GMV | $4,000 | $0 | Not started |
| KR2.3 - Film page to purchase conversion rate | >= 5% | -- | Not started |
| KR2.4 - Repeat purchase rate (viewer buys 2+ films) | >= 15% | -- | Not started |

### Objective 3: Ship MVP on time and under budget

| Key Result | Target | Current | Status |
|-----------|--------|---------|--------|
| KR3.1 - Launch in <= 6 weeks from start | Week 6 | Week 0 | In progress |
| KR3.2 - All P0 acceptance criteria shipped | 100% | 0% | Not started |
| KR3.3 - Zero critical security issues at launch | 0 | -- | Not started |
| KR3.4 - Infra cost < $500/mo at 150 films | < $500 | -- | Not started |

---

## 3. KPI Dashboard

### Supply-Side KPIs (Filmmaker)

| KPI | Formula | Cadence | Target (M1) |
|-----|---------|---------|-------------|
| Filmmaker signups | COUNT(profiles WHERE is_filmmaker=true) | Daily | 200 |
| Stripe onboarding rate | stripe_onboarded / signups | Weekly | >= 80% |
| Films published | COUNT(films WHERE status='published') | Daily | 150 |
| Films per filmmaker | published_films / filmmaker_signups | Weekly | >= 0.75 |
| Upload completion rate | uploads_completed / uploads_started | Weekly | >= 90% |
| Upload error rate | errors / uploads | Weekly | < 5% |
| Filmmaker 30-day retention | Filmmakers active at day 30 | Monthly | >= 40% |

### Demand-Side KPIs (Viewer)

| KPI | Formula | Cadence | Target (M1) |
|-----|---------|---------|-------------|
| Film page views | SUM(film_page_viewed events) | Daily | 5,000 |
| Trailer play rate | trailer_played / film_page_viewed | Weekly | >= 30% |
| Buy click rate | buy_clicked / film_page_viewed | Weekly | >= 10% |
| Checkout conversion | purchase_completed / checkout_started | Weekly | >= 70% |
| Viewer purchases | COUNT(purchases) | Daily | 500 |
| GMV | SUM(amount_cents) / 100 | Daily | $4,000 |
| Repeat purchase rate | viewers with 2+ purchases / all viewers | Monthly | >= 15% |
| Film completion rate | completed=true / watch_sessions | Weekly | >= 50% |

### Revenue KPIs

| KPI | Formula | Cadence | Target (M1) |
|-----|---------|---------|-------------|
| Platform revenue | SUM(platform_fee_cents) / 100 | Daily | $600 |
| Avg revenue per film | GMV / published_films | Weekly | >= $27 |
| Net revenue (after Stripe) | platform_revenue x 0.55 | Monthly | >= $330 |
| Infra cost | CF + Supabase + Vercel + Resend bills | Monthly | < $200 |
| Gross margin | (platform_revenue - infra) / platform_revenue | Monthly | >= 60% |

---

## 4. Funnel Analysis

### Filmmaker Activation Funnel

```
Filmmaker Signup
  -> Stripe Connect Started       target: 90% of signups
    -> Stripe Connect Completed   target: 80% of signups
      -> Film Draft Created       target: 70% of onboarded
        -> Film Published         target: 60% of onboarded
          -> First Sale           target: 30% in month 1
```

### Viewer Conversion Funnel

```
Film Page View (100%)
  -> Trailer Played               target: 30%
    -> Buy Clicked                target: 10%
      -> Checkout Open            target: 8%
        -> Purchased              target: 5% of page views
          -> Watched to completion target: 50% of purchases
            -> Repeat Purchase    target: 15% buy again
```

---

## 5. Unit Economics Model

| Metric | Value | Notes |
|--------|-------|-------|
| Avg buy price | $8.00 | Filmmaker-set; platform default suggestion |
| Avg rent price | $4.00 | 48hr access |
| Platform gross cut (15%) | $1.20 buy / $0.60 rent | Destination charge |
| Stripe fee (~3% + $0.30) | $0.54 (buy) | Per transaction |
| Net per buy sale | **$0.66** | After Stripe fees |
| Net per rent sale | **$0.30** | After Stripe fees |
| CF Stream cost/view | ~$0.02 | Per 90-min stream |
| CF Storage/film/mo | ~$0.30 | Per 2GB film |
| **Break-even** | **~100 sales/mo** | At avg $0.66 net, covers $66/mo base infra |

### Scenario Modeling

| Scenario | Films | Sales/film/mo | GMV | Platform Net |
|----------|-------|--------------|-----|-------------|
| Conservative | 50 | 10 | $4,000 | $264 |
| Base | 150 | 20 | $24,000 | $1,584 |
| Optimistic | 400 | 30 | $96,000 | $6,336 |

---

## 6. Analytics Infrastructure

### Event Collection

| Tool | Role | Cost |
|------|------|------|
| Supabase `watch_sessions` | Watch completion, duration | Free (DB) |
| Vercel Analytics | Page views, Web Vitals | Free tier |
| Custom events table (Supabase) | All funnel events | Free (DB) |
| Stripe Dashboard | Revenue, payouts, disputes | Included |

> NOTE: Avoid third-party analytics (Mixpanel, Amplitude) in MVP. Use Supabase + Vercel Analytics.
> Migrate to PostHog self-hosted if volume > 100K events/mo.

### Reporting Cadence

| Report | Cadence | Audience |
|--------|---------|----------|
| Daily KPI snapshot | Daily | CEO |
| Weekly funnel review | Monday | CEO + Eng |
| Monthly OKR check-in | 1st of month | CEO |
| Filmmaker earnings report | Monthly auto-email | Filmmakers |

---

## 7. Alerts & Anomaly Detection

| Alert | Threshold | Channel |
|-------|-----------|--------|
| Stripe webhook failure | Any error | Email + Supabase log |
| Upload error rate > 10% | Rolling 1hr | Slack/Discord |
| Zero purchases in 24hr | After launch | Email to CEO |
| Cloudflare Stream error spike | > 5 errors/hr | Email |
| Platform revenue drops 50% WoW | -- | Dashboard alert |

---

## 8. Experimentation Roadmap (Post-Launch)

| Experiment | Hypothesis | Metric | Min Sample |
|-----------|-----------|--------|------------|
| Default price nudge ($8 vs. no default) | Suggested price increases avg price | avg_buy_price_cents | 500 film pages |
| "Rent" button A/B position | Rent CTA prominence increases rental rate | rent_clicked / page_view | 1,000 page views |
| Email subject line test | Urgency copy increases open rate | email_open_rate | 500 emails |
| Free film gating (no auth vs. auth required) | Auth gate reduces viewer signups | viewer_signup_rate | 2,000 page views |
