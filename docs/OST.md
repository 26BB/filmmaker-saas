# FilmDrop - Opportunity Solution Tree

> **Framework**: Teresa Torres - Continuous Discovery
> **Last Updated**: 2026-09-27
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

---

## Desired Outcome

> **Filmmakers earn revenue from their films on FilmDrop**
> *(Proxy: GMV / Purchases per week)*

---

## Opportunity 1 - Filmmakers can't get their films discoverable

*Pain: "I upload a film but no one watches it."*

### Sub-Opportunity 1.1 - Poor SEO visibility
**Evidence**: Film pages not indexed; title searches don't return FilmDrop

| Solution | Assumption to Test |
|----------|-------------------|
| SSR film pages with dynamic OG + meta | Google indexes SSR pages within 48hr |
| Genre/country browse pages | Long-tail SEO drives 20%+ of film page traffic |
| Dynamic sitemap.xml | Sitemap submission increases crawl frequency |

### Sub-Opportunity 1.2 - Filmmakers don't share their film page
**Evidence**: Low referral traffic from social; filmmaker retention drops after upload

| Solution | Assumption to Test |
|----------|-------------------|
| Pre-built social share card (OG image with poster) | Filmmakers share when sharing is 1-click easy |
| "Share your film" post-upload prompt | Prompted sharing increases social referral 2x |
| "Powered by FilmDrop" badge (opt-out) | Badge drives 5%+ of new viewer traffic |

### Sub-Opportunity 1.3 - No filmmaker profile page / brand
**Evidence**: Viewers have no way to follow a filmmaker; no repeat discovery

| Solution | Assumption to Test |
|----------|-------------------|
| `/filmmaker/[username]` profile page | Profile pages increase filmmaker's film views 30%+ |
| "Follow filmmaker" feature (v2) | Follow -> notification = repeat viewer loop |

---

## Opportunity 2 - Viewers don't convert from browsing to buying

*Pain: "I watched the trailer but didn't buy."*

### Sub-Opportunity 2.1 - Viewer doesn't trust an unknown film
**Evidence**: High trailer play rate but low buy-click rate (< 5%)

| Solution | Assumption to Test |
|----------|-------------------|
| Festival laurel display on film page | Laurels increase buy CVR by 20%+ |
| Filmmaker statement / director's note | Personal story increases emotional connection -> buy |
| Purchase count social proof ("47 people bought this") | Social proof increases CVR for films with > 10 purchases |

### Sub-Opportunity 2.2 - Price friction ("too expensive for unknown film")
**Evidence**: Buy clicks on free/cheap films >> paid films; cart abandonment data

| Solution | Assumption to Test |
|----------|-------------------|
| Rental option prominently placed | Rent CTA increases total revenue per film |
| Free trailer = full film for short films < 5min | Free content increases brand trust -> purchase of next film |
| Pay-what-you-want option (filmmaker-configurable) | PWYW increases purchase volume, decreases avg price - net positive? |

### Sub-Opportunity 2.3 - Checkout is too much friction
**Evidence**: High checkout open rate but < 70% checkout completion

| Solution | Assumption to Test |
|----------|-------------------|
| Stripe Link (1-click checkout for returning users) | Stripe Link increases checkout CVR 15%+ |
| Guest checkout (no account required for purchase) | Auth gate causes 30%+ drop-off |

---

## Opportunity 3 - Filmmakers don't complete Stripe onboarding

*Pain: "The Stripe Connect setup was confusing / I gave up."*

### Sub-Opportunity 3.1 - Onboarding feels risky or complex
**Evidence**: < 80% of filmmaker signups complete Stripe Connect

| Solution | Assumption to Test |
|----------|-------------------|
| Step-by-step onboarding checklist (3 steps: signup, connect, upload) | Visual progress increases completion by 20%+ |
| FAQ: "Why does FilmDrop need my bank info?" inline | Trust explanation reduces abandonment at Stripe step |
| "Skip for now" with reminder email at 24hr | Delay + nudge recovers 15%+ of abandoned onboardings |

### Sub-Opportunity 3.2 - Filmmaker not ready to receive money (no business entity)
**Evidence**: Some filmmakers are hobbyists, no LLC/tax ID

| Solution | Assumption to Test |
|----------|-------------------|
| Allow personal SSN for sole proprietors (Stripe handles) | Stripe Express accepts individuals - confirm this |
| "Free films only" mode (no Stripe needed) | Free film mode drives initial upload volume |

---

## Opportunity 4 - Filmmakers don't upload more than 1 film

*Pain: "I uploaded once, nothing happened, I left."*

### Sub-Opportunity 4.1 - No feedback loop after first upload
**Evidence**: Filmmaker uploads 1 film, doesn't return to dashboard

| Solution | Assumption to Test |
|----------|-------------------|
| Earnings milestone email: "You just earned your first dollar!" | Milestone notification increases day-14 retention 25%+ |
| Weekly filmmaker digest: views, purchases, revenue | Weekly email increases dashboard visits |
| "Upload your next film" prompt after first sale | Prompt after sale increases second upload rate |

### Sub-Opportunity 4.2 - Upload experience is too slow or unreliable
**Evidence**: Upload error rate > 5%; large files time out

| Solution | Assumption to Test |
|----------|-------------------|
| Resumable upload (tus) - in scope for MVP | tus eliminates timeout errors for files > 500MB |
| Upload progress bar with ETA | ETA display reduces abandonment during long uploads |
| Email notification when upload finishes processing | Async notification = filmmaker doesn't need to wait |

---

## Opportunity 5 - Platform not trusted for serious filmmakers

*Pain: "Is FilmDrop legit? Will my film be safe?"*

### Sub-Opportunity 5.1 - No social proof of platform credibility
**Evidence**: Low filmmaker signup rate from cold outreach

| Solution | Assumption to Test |
|----------|-------------------|
| Press coverage (IndieWire, No Film School) | Press increases weekly filmmaker signups by 3x |
| "Featured on FilmDrop" filmmaker testimonials | Testimonials increase cold-outreach conversion 20%+ |
| Transparent earnings dashboard (anonymized stats) | Public stats = "this actually works" |

### Sub-Opportunity 5.2 - Piracy concern (signed URLs not DRM)
**Evidence**: Filmmakers ask about DRM before uploading premium content

| Solution | Assumption to Test |
|----------|-------------------|
| Explain signed URL protection clearly on upload page | Explanation satisfies 80%+ of filmmaker piracy concern |
| Watermarking (visual) - v2 | Watermarking increases premium film uploads |
| Optional "festival only" mode (unpublish after date) | Time-limited access = safe for festival-circuit films |

---

## Experiment Priority Matrix

| Experiment | Impact | Confidence | Effort | Priority |
|-----------|--------|-----------|--------|----------|
| SSR SEO film pages | High | High | Low (built) | P0 |
| tus resumable upload | High | High | Low (built) | P0 |
| Festival laurels on film page | High | Medium | Low | P1 |
| Rental CTA prominence A/B | High | Medium | Low | P1 |
| Filmmaker onboarding checklist | High | Medium | Low | P1 |
| Milestone earnings email | Medium | High | Low | P1 |
| Social share card auto-gen | Medium | Medium | Medium | P2 |
| Guest checkout | High | Low | Medium | P2 |
| Pay-what-you-want | Medium | Low | Medium | P3 |
| Watermarking | Medium | Medium | High | P3 |

---

## Assumption Testing Log

| Assumption | Test Method | Status | Result |
|-----------|------------|--------|--------|
| Displaced Vimeo filmmakers will sign up | Direct outreach to 50 Reddit/Twitter users | Pre-launch | -- |
| Viewers will pay $4-$12 for indie films | 3 beta films listed with real prices | Week 6 | -- |
| 85% revenue share is compelling vs. alternatives | Filmmaker survey (n=20) | Pre-launch | -- |
| Signed URLs sufficient (no Widevine needed) | 0 piracy complaints in beta | Month 1 | -- |
| Stripe Connect < 10min for filmmakers | Usability test with 3 filmmakers | Week 5 | -- |
