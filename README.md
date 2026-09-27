# 🎬 FilmDrop — Filmmaker SaaS Platform

> **Gumroad for indie filmmakers.** Upload a film, set a price, keep 85%. We handle hosting, streaming, and payments.

## 🚨 Market Opportunity

Vimeo On Demand shut down on **September 21, 2026** — thousands of indie filmmakers just lost their primary TVOD platform. FilmDrop fills this exact gap with zero gatekeeping.

## What It Is

- Indie filmmakers upload short films, documentaries, features
- They set their own price (TVOD — buy or rent)
- Viewers pay directly, filmmakers keep **85%** of every sale
- Platform takes **15%** + handles all infrastructure
- Zero upfront cost for anyone

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Database + Auth | Supabase (PostgreSQL + RLS) |
| Video Hosting | Cloudflare Stream |
| Payments | Stripe + Connect Express |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |
| Email | Resend |

## Project Structure

```
filmmaker-saas/
├── apps/web/          # Next.js 15 application
├── supabase/          # DB migrations
├── docs/              # Planning docs
└── README.md
```

## Roadmap

- [x] Project setup + planning docs
- [ ] Phase 1: Auth + DB schema
- [ ] Phase 2: Upload pipeline (Cloudflare Stream + tus)
- [ ] Phase 3: Payments (Stripe Connect)
- [ ] Phase 4: Discovery + SEO
- [ ] Phase 5: Analytics + Polish
- [ ] Phase 6: Launch 🚀

## Revenue Model

| Item | Amount |
|------|--------|
| Film avg price | $8 buy / $4 rent |
| Platform cut | 15% |
| Filmmaker cut | 85% |
| Break-even | ~100 film uploads |

## License

MIT
