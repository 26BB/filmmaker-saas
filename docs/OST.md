# FilmDrop — Opportunity Solution Tree

> **Framework**: Teresa Torres — Continuous Discovery
> **Last Updated**: 2026-09-27
> **Company Base**: India
> **Markets**: India (INR) + International (USD)
> **Outcome**: *Filmmakers earn revenue from their films on FilmDrop*

---

## How to Read This Tree

```
Desired Outcome
  -> Opportunity (unmet need / pain / gap)
    -> Sub-Opportunity (more specific)
      -> Solution (experiment / feature)
        -> Assumption (what must be true)
```

Market labels: [IN] = India-specific, [INTL] = International-specific, [BOTH] = applies to both.

---

## Desired Outcome

> **Filmmakers earn revenue from their films on FilmDrop**
> *(Proxy: GMV per week — INR + USD combined)*

---

## Opportunity 1 — Indian filmmakers have no INR-native TVOD home [IN]

*Pain: "I want to sell my Malayalam short film in India. Gumroad only does USD. BookMyShow won't take indie content."*

### Sub-Opportunity 1.1 — No UPI payment option on existing platforms
**Evidence**: Vimeo On Demand was USD-only; Gumroad is USD-only; Indian viewers default to UPI

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| Razorpay Checkout with UPI + Cards + NetBanking | UPI availability increases India checkout CVR to 80%+ | IN |
| INR pricing by default for Indian filmmakers | INR pricing reduces price-resistance vs. USD equivalent | IN |
| IP-based currency detection (India -> INR, others -> USD) | Auto-detection reduces currency confusion friction | BOTH |

### Sub-Opportunity 1.2 — Indian filmmaker can't receive INR payouts easily
**Evidence**: Stripe India payouts have delays; filmmakers want direct bank transfer in INR

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| Razorpay Route for filmmaker bank account payout | Razorpay Route onboarding < 15 minutes for Indian filmmakers | IN |
| PAN-based TDS compliance auto-handled by Razorpay | TDS auto-deduction removes compliance anxiety from filmmaker | IN |
| Weekly INR settlement to filmmaker bank account | Weekly vs. monthly payout increases filmmaker satisfaction | IN |

### Sub-Opportunity 1.3 — Indian regional language films have no discovery channel
**Evidence**: No platform categorizes films by language; Malayalam/Tamil indie films have zero online TVOD presence

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| Language filter on browse page (Hindi, Tamil, Malayalam, Marathi, Bengali, Kannada) | Language filter is used in 20%+ of browse sessions by India viewers | IN |
| `/language/malayalam` dedicated SEO page | Language-specific pages rank for "[language] short films watch online" | IN |
| "Trending in [language]" section on homepage | Language-segmented discovery increases click-through on India-targeted films | IN |

---

## Opportunity 2 — Displaced Vimeo On Demand filmmakers need a new home [INTL]

*Pain: "Vimeo shut down. I have 3 films I was selling for $8 each. Where do I go?"*

### Sub-Opportunity 2.1 — No easy migration path from Vimeo
**Evidence**: Filmmakers have Vimeo links, existing audiences, and need to preserve SEO

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| "Import from Vimeo" flow (paste Vimeo URL, we fetch metadata) — v2 | Migration tool increases intl. filmmaker signup-to-publish rate 2x | INTL |
| Redirect capture: "/from-vimeo" landing page | Targeted landing page converts Vimeo refugees at 30%+ | INTL |
| Support for existing Vimeo audience emails (filmmaker uploads CSV) — v2 | Filmmaker can notify existing buyers = first-week sales | INTL |

### Sub-Opportunity 2.2 — International filmmakers skeptical of new platform
**Evidence**: Low cold-outreach conversion; trust concerns

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| Press coverage (IndieWire, No Film School, Variety) | Press increases weekly intl. filmmaker signups 3x | INTL |
| Public earnings stats page (anonymized): "$X paid to filmmakers this month" | Transparency signals platform legitimacy | INTL |
| Founding Filmmaker badge (90/10 for life) | Revenue incentive converts skeptical filmmakers | INTL |

---

## Opportunity 3 — Viewers don't convert from browsing to buying [BOTH]

*Pain: "I watched the trailer but didn't buy."*

### Sub-Opportunity 3.1 — Viewer doesn't trust an unknown film [BOTH]

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| Festival laurel display (MAMI, IFFK, BIFF for India; Sundance, SXSW for intl.) | Laurels increase buy CVR by 20%+ | BOTH |
| Director's note / filmmaker statement | Personal story increases emotional connection -> buy | BOTH |
| Purchase count social proof ("47 people bought this") | Social proof increases CVR for films with > 10 purchases | BOTH |

### Sub-Opportunity 3.2 — Price friction [IN-specific]
**Evidence**: Indian viewers price-sensitive; Rs.199 feels like a commitment for unknown content

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| Rental at Rs.49–Rs.79 (48hr) prominently placed | Rent option increases total India revenue per film | IN |
| Rs.99 "micro-pricing" for short films < 20min | Sub-Rs.100 pricing crosses impulse-buy threshold | IN |
| Free full film for films < 5min | Free content drives filmmaker profile views -> paid purchases | IN |

### Sub-Opportunity 3.3 — Checkout friction too high [BOTH]

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| UPI QR code on checkout page (India) | UPI QR reduces checkout time to < 30 seconds | IN |
| Razorpay one-click for returning India users | Saved UPI VPA increases repeat purchase CVR 20%+ | IN |
| Stripe Link (1-click for intl. returning users) | Stripe Link increases intl. checkout CVR 15%+ | INTL |
| Guest checkout (no account required) | Auth gate causes 30%+ India mobile drop-off | IN |

---

## Opportunity 4 — Filmmakers don't complete payout onboarding [BOTH]

*Pain: "The Razorpay setup asked for too many documents" / "Stripe Connect was confusing"*

### Sub-Opportunity 4.1 — India: Razorpay Route KYC complexity [IN]
**Evidence**: Razorpay Route requires PAN + bank account; some filmmakers don't have a current account

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| Step-by-step onboarding checklist (3 steps: signup, bank connect, upload) | Visual progress increases Razorpay completion by 20%+ | IN |
| "Free films only" mode (no bank account needed) | Allows filmmakers to publish + build audience before KYC | IN |
| WhatsApp support link during Razorpay onboarding | India filmmakers prefer WhatsApp support to email | IN |
| FAQ: "Does FilmDrop store my bank info?" inline | Trust copy reduces Razorpay abandonment | IN |

### Sub-Opportunity 4.2 — International: Stripe complexity [INTL]

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| "Skip for now" with email reminder at 24hr | Delay + nudge recovers 15%+ of abandoned Stripe onboardings | INTL |
| FAQ: "Why does FilmDrop need my SSN?" inline | Explanation reduces Stripe step abandonment | INTL |

---

## Opportunity 5 — Filmmakers don't upload more than 1 film [BOTH]

*Pain: "I uploaded once, nothing happened, I left."*

### Sub-Opportunity 5.1 — No feedback loop after first upload [BOTH]

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| "First sale" milestone email: "Aapki pehli kamai!" (India) / "You earned!" (Intl.) | Milestone email increases day-14 retention 25%+ | BOTH |
| Weekly digest: views, purchases, INR/USD revenue | Weekly email increases dashboard revisit rate | BOTH |
| "Upload your next film" prompt after first sale | Prompt after sale increases second upload rate 30%+ | BOTH |

### Sub-Opportunity 5.2 — India: WhatsApp community for filmmakers [IN]
**Evidence**: Indian creators organize and get feedback via WhatsApp groups, not email

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| FilmDrop filmmaker WhatsApp group (invite after signup) | WhatsApp community increases 30-day filmmaker retention 20%+ | IN |
| Monthly WhatsApp earnings digest with peer benchmark | Peer comparison motivates more uploads | IN |

---

## Opportunity 6 — Platform not trusted for piracy-sensitive content [BOTH]

*Pain: "Will my film get pirated? Malayalam films are especially targeted."*

### Sub-Opportunity 6.1 — Signed URLs perceived as insufficient [BOTH]

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| Clear explanation of signed URL protection on upload page | Explanation satisfies 80%+ of filmmaker piracy concern | BOTH |
| Visual watermarking — v2 | Watermarking increases premium content uploads | BOTH |
| "Report piracy" button for viewers | Community reporting catches violations within 24hr | BOTH |

### Sub-Opportunity 6.2 — IT Act compliance concern (India) [IN]
**Evidence**: Indian filmmakers aware of content theft; want platform to take IT Act 2000 action

| Solution | Assumption to Test | Market |
|----------|-------------------|---------|
| DMCA + IT Act 2000 takedown process documented publicly | Published takedown process increases filmmaker confidence | IN |
| "Report copyright violation" link on every film page | India filmmakers use report feature within first month | IN |

---

## Experiment Priority Matrix

| Experiment | Impact | Confidence | Effort | Priority | Market |
|-----------|--------|-----------|--------|----------|---------|
| Razorpay UPI checkout | High | High | Low (built) | P0 | IN |
| INR pricing + IP detection | High | High | Low | P0 | IN |
| Language filter on browse | High | High | Low | P0 | IN |
| tus resumable upload | High | High | Low (built) | P0 | BOTH |
| Festival laurels (MAMI/IFFK for India) | High | Medium | Low | P1 | BOTH |
| Rs.99 micro-pricing for short films | High | Medium | Low | P1 | IN |
| Filmmaker onboarding checklist | High | Medium | Low | P1 | BOTH |
| WhatsApp share button on film page | High | High | Low | P1 | IN |
| Milestone earnings email (bilingual) | Medium | High | Low | P1 | BOTH |
| WhatsApp filmmaker community | Medium | Medium | Low | P2 | IN |
| Vimeo import flow | High | Low | High | P2 | INTL |
| Guest checkout | High | Low | Medium | P2 | IN |
| Language SEO pages (/language/malayalam) | Medium | Medium | Low | P2 | IN |
| Watermarking | Medium | Medium | High | P3 | BOTH |

---

## Assumption Testing Log

| Assumption | Test Method | Status | Result |
|-----------|------------|--------|--------|
| Indian indie filmmakers want INR-native TVOD | DM 20 MAMI/IFFK filmmakers on Instagram | Pre-launch | -- |
| UPI increases India checkout CVR vs. card-only | A/B test in Month 1 | Month 1 | -- |
| Viewers will pay Rs.99–Rs.299 for indie films | 5 beta films with real INR prices | Week 6 | -- |
| Vimeo refugees will migrate without import tool | Direct outreach to 30 Vimeo creators | Pre-launch | -- |
| 85% revenue share is compelling | Filmmaker survey (n=20, India + intl.) | Pre-launch | -- |
| Signed URLs sufficient (no Widevine needed) | 0 piracy complaints in beta | Month 1 | -- |
| Razorpay Route KYC < 15min for Indian filmmakers | Usability test with 3 filmmakers | Week 5 | -- |
| WhatsApp community increases retention | Compare 30-day retention: WhatsApp vs. non-WhatsApp | Month 2 | -- |
| Language filter used by India viewers | Analytics: filter_used / india_sessions | Month 1 | -- |
