# FilmDrop - Go-To-Market Strategy

> **Status**: Draft
> **Launch Window**: Week 6 (early November 2026)
> **Market Signal**: Vimeo On Demand shut down Sept 21, 2026 - window is NOW

---

## 1. Strategic Context

This is a **window-of-opportunity launch**, not a cold-start. Vimeo On Demand's shutdown created an immediate, emotionally charged supply of displaced filmmakers actively searching for alternatives. Our GTM has **two distinct motions** running in parallel:

| Motion | Target | Goal |
|--------|--------|------|
| **Supply acquisition** | Indie filmmakers | Get 50 films uploaded at launch |
| **Demand seeding** | Film viewers | Drive first 500 purchases in Week 1 |

---

## 2. Ideal Customer Profile (ICP)

### Filmmaker ICP - "The Displaced Creator"

| Signal | Detail |
|--------|--------|
| Was on Vimeo On Demand | Active Vimeo Pro/OTT user pre-Sept 2026 |
| Has completed film | Short film, doc, or feature ready to distribute |
| Self-distributes | No deal with MUBI, Fandor, or major distributor |
| Film festival circuit | Submitted to Sundance, SXSW, Tribeca, or similar |
| Social presence | Instagram, Twitter/X, or filmmaker blog |
| Revenue expectation | Willing to try if zero upfront cost + >= 85% rev share |

### Viewer ICP - "The Niche Film Enthusiast"

| Signal | Detail |
|--------|--------|
| Watches on Mubi, Criterion | Pays for curated indie content |
| Follows filmmakers on social | Direct relationship with creator |
| Already watches shorts online | Vimeo Staff Picks, Short of the Week audience |
| Disposable income | $4-$12 per film is low friction |

---

## 3. Phase 1 - Warm Outreach (Weeks 4-5, pre-launch)

### 3.1 Vimeo On Demand Refugee Targeting

**Why**: These filmmakers are emotionally primed - they just lost their platform. They're in Facebook groups, Reddit, Twitter threads actively asking "what do I use now?"

**Channels**:
- Reddit: `r/Filmmakers`, `r/indiefilm`, `r/videography`
- Facebook Groups: indie film creator groups
- Twitter/X: Search `"Vimeo On Demand" alternative`, reply with empathy + link
- Film school alumni networks (DMs)

**Message framework**:
> *"We built FilmDrop specifically because Vimeo On Demand shut down. Upload your film, set your price, keep 85%. No curation, no gatekeeping, zero upfront cost. Beta is open - [filmdrop.io]"*

**Goal**: 20 filmmakers recruited in pre-launch with films ready to go live on Day 1.

### 3.2 Film Festival Community Outreach

- Contact festival programming coordinators (Tribeca, SXSW, Sundance alumni)
- Pitch: *"Your accepted films deserve a revenue stream. FilmDrop = your own TVOD store."*
- Offer: First 100 filmmakers get 90/10 split for 6 months (vs. standard 85/15)

### 3.3 Beta Filmmaker Waitlist

- Build `/waitlist` page before full launch
- Collect: name, email, film title, Vimeo URL (social proof + import intent)
- Target: 100 waitlist signups before launch
- Email sequence: 3 onboarding emails (day 0, day 3, day 7)

---

## 4. Phase 2 - Launch Day (Week 6)

### 4.1 Product Hunt Launch

| Element | Content |
|---------|--------|
| Tagline | "The indie filmmaker's TVOD platform - 85% rev share, zero gatekeeping" |
| First comment | Tell the Vimeo On Demand story - emotional hook |
| Gallery | Screenshots: upload flow, filmmaker dashboard, film page |
| Maker Q&A | CEO available live for 4 hours |
| Goal | Top 5 Product of the Day |
| Hunter | Recruit a top-hunter with 1,000+ followers |

**Pre-launch checklist**:
- [ ] PH asset package: logo, tagline, 5 screenshots, demo video (90 sec)
- [ ] Notify waitlist: "We're live on Product Hunt - support us!"
- [ ] Coordinate upvotes from film community contacts
- [ ] First 10 films already published (social proof)

### 4.2 Hacker News - Show HN

**Post**: `Show HN: FilmDrop - we built a TVOD platform in 6 weeks because Vimeo shut down`

**Body excerpt**:
> *Vimeo On Demand shut down 6 weeks ago. Thousands of indie filmmakers had no self-serve alternative. We built FilmDrop: upload your film, set your price, keep 85%. Powered by Next.js, Cloudflare Stream, Stripe Connect. Feedback welcome.*

**Timing**: Tuesday 10am EST (peak HN traffic)

### 4.3 Reddit Launch Posts

| Subreddit | Angle |
|-----------|-------|
| `r/indiefilm` | "We built FilmDrop for Vimeo refugees - here's what we shipped" |
| `r/Filmmakers` | Demo + behind-the-scenes build thread |
| `r/startups` | "6-week build, market timing, and unit economics" |
| `r/SideProject` | Indie hacker story angle |

---

## 5. Phase 3 - Growth Loops (Post-Launch)

### 5.1 Filmmaker Virality Loop

```
Filmmaker uploads -> Shares film page on social -> Viewer clicks link
-> Viewer purchases -> Filmmaker earns -> Filmmaker uploads more films
     ^__________________________________________________|
```

**Accelerators**:
- "Powered by FilmDrop" badge on film pages (opt-out)
- Social share card pre-generated with film poster + filmmaker name
- Filmmaker referral: "Invite a filmmaker, both get 90/10 for 3 months"

### 5.2 SEO & Content Loop

| Page Type | Volume | SEO Value |
|-----------|--------|----------|
| `/film/[slug]` | 1 per film | Long-tail: "[Film Title] watch online" |
| `/filmmaker/[username]` | 1 per filmmaker | Brand search |
| `/genre/[genre]` | ~15 pages | Category search |
| Sitemap.xml | Dynamic | Google crawlability |

**Target keywords**: `"indie film streaming"`, `"watch indie documentaries online"`, `"Vimeo On Demand alternative"`

### 5.3 Email Nurture

**Filmmaker sequence**:
1. Day 0 - Welcome + setup guide
2. Day 3 - "Your first film is live - share it"
3. Day 14 - Earnings report + tips to boost views
4. Day 30 - "Filmmakers earning $X on FilmDrop this month"

**Viewer sequence**:
1. Post-purchase - Receipt + watch link
2. Day 7 - "Films similar to [purchased film]"
3. Day 30 - "New films from [filmmaker name]"

---

## 6. Pricing & Positioning

| Axis | FilmDrop | Gumroad | MUBI | Fandor |
|------|----------|---------|------|--------|
| Revenue share | **85%** | 90% | Licensing | Licensing |
| Self-serve | Yes | Yes | No | No |
| Video player | Yes | No | Yes | Yes |
| TVOD model | Yes | Yes | No | No |
| Filmmaker KYC | Stripe handles | Stripe handles | Manual | Manual |
| Status | Active | Active | Active | Active |
| Vimeo On Demand | -- | -- | -- | **DEAD (Sept 2026)** |

**Positioning statement**: *"FilmDrop is the self-serve TVOD platform for indie filmmakers - the home Vimeo On Demand should have been."*

---

## 7. Launch Metrics Targets

| Metric | Week 1 | Month 1 | Month 3 |
|--------|--------|---------|--------|
| Filmmaker signups | 50 | 200 | 500 |
| Films published | 30 | 150 | 400 |
| Purchases | 100 | 500 | 2,000 |
| GMV | $800 | $4,000 | $16,000 |
| Platform revenue (15%) | $120 | $600 | $2,400 |
| Waitlist -> activated | 40% | -- | -- |

---

## 8. PR & Media

| Outlet | Angle | Contact |
|--------|-------|--------|
| The Verge | "The startup that sprinted to replace Vimeo On Demand" | Tips email |
| IndieWire | "Where to distribute your indie film after Vimeo" | Film desk |
| No Film School | "FilmDrop: 85% rev share for indie filmmakers" | Sponsored or editorial |
| Hacker News | Show HN - organic | Post directly |
| Film Courage (YouTube) | Interview / demo | DM |

---

## 9. Early Adopter Incentive

> **"Founding Filmmaker" Program** - First 100 filmmakers:
> - **90/10 revenue split for life** (vs. standard 85/15)
> - Founding Filmmaker badge on profile
> - Direct access to founders via Discord/Slack
> - Co-marketing: featured in FilmDrop launch PR

**Cost**: Giving up 5% x avg $1.20/sale x 100 filmmakers x avg 50 sales/mo = **$30/mo** in forgone revenue. Trivial acquisition cost.

---

## 10. Key Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Slow filmmaker adoption | Medium | High | Direct Vimeo refugee outreach, Founding Filmmaker incentive |
| Low viewer conversion | Medium | High | Strong trailer UX, social proof, free films for discovery |
| Stripe Connect approval delay | Low | High | Apply day 1 of build (week 1) |
| Content quality issues | Medium | Medium | ToS, DMCA process, curator flag v2 |
| Competitor fast follower | Low | Medium | Speed + community moat first |
