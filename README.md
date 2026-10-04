# 🎬 FilmDrop — Filmmaker SaaS Platform

> **Gumroad for indie filmmakers.** Upload a film, set a price, keep 85%. We handle hosting, streaming, and direct payouts.

[![Live on Vercel](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel)](https://web-mu-one-15.vercel.app)
[![CI Pipeline](https://img.shields.io/badge/GitHub_Actions-Passing-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/26BB/filmmaker-saas/actions)
[![Next.js 15](https://img.shields.io/badge/Next.js_15-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

---

## 🚀 Live Demo & Production Links

- 🌐 **Live Website**: [https://web-mu-one-15.vercel.app](https://web-mu-one-15.vercel.app)
- 🍿 **Browse Premieres**: [https://web-mu-one-15.vercel.app/browse](https://web-mu-one-15.vercel.app/browse)
- 🎞️ **Sample Film Detail Page**: [https://web-mu-one-15.vercel.app/film/neon-solitude](https://web-mu-one-15.vercel.app/film/neon-solitude)
- 🎥 **Watch Room Player**: [https://web-mu-one-15.vercel.app/watch/neon-solitude](https://web-mu-one-15.vercel.app/watch/neon-solitude)
- 🎬 **Filmmaker Creator Studio**: [https://web-mu-one-15.vercel.app/dashboard](https://web-mu-one-15.vercel.app/dashboard)
- 💳 **Stripe Payouts Portal**: [https://web-mu-one-15.vercel.app/dashboard/payouts](https://web-mu-one-15.vercel.app/dashboard/payouts)
- 📚 **Viewer Library**: [https://web-mu-one-15.vercel.app/library](https://web-mu-one-15.vercel.app/library)

---

## 🚨 Market Opportunity

Vimeo On Demand shut down on **September 21, 2026** — thousands of indie filmmakers lost their primary TVOD platform. FilmDrop fills this exact gap with self-serve uploads, 4K streaming, and zero gatekeeping.

## What It Is

- Indie filmmakers upload short films, documentaries, and features
- They set their own price (TVOD — lifetime buy or 48h rental)
- Viewers pay directly via Stripe Checkout
- Filmmakers keep **85%** of every sale with instant Stripe Connect payouts
- Platform takes **15%** and manages Cloudflare Stream 4K hosting, DRM signed URLs, and infrastructure
- Zero upfront subscription or hosting fees for creators

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript | Server & Client Components, Responsive Dark Cinema Theme |
| **Styling** | Tailwind CSS, Lucide Icons | Responsive for Mobile, Tablet & Desktop |
| **Database** | Neon Serverless PostgreSQL & Supabase | Dual DB query pooling & Row Level Security (RLS) |
| **Auth & Services** | Firebase & Supabase SSR | Client & Admin SDKs with session middleware |
| **Video Infrastructure** | Cloudflare Stream + tus-js-client | Chunked resumable uploads & RSA-256 signed playback tokens |
| **Payments** | Stripe + Connect Express | Automated 85/15 destination charges & webhook sync |
| **Email** | Resend | Transactional purchase receipts & filmmaker payout alerts |
| **Deployment & CI** | Vercel & GitHub Actions | Automated build validation and edge network deployment |

---

## 📂 Project Structure

```
filmmaker-saas/
├── .github/workflows/       # GitHub Actions CI pipeline
├── apps/
│   └── web/                 # Next.js 15 production application
│       ├── app/             # App Router pages & REST API endpoints
│       │   ├── api/         # Stripe, Cloudflare, Upload & Analytics routes
│       │   ├── browse/      # Film discovery catalog & filters
│       │   ├── dashboard/   # Filmmaker studio, film manager & payouts
│       │   ├── film/[slug]/ # Public film detail & checkout
│       │   ├── watch/[slug]/# Protected playback room
│       │   └── library/     # Unlocked viewer library
│       ├── components/      # VideoPlayer, TusUploader, FilmCard, Navbar
│       ├── lib/             # Neon DB, Firebase, Supabase, Stripe & Cloudflare
│       └── vercel.json      # App-level deployment configuration
├── supabase/migrations/     # PostgreSQL schema migrations & RLS policies
├── docs/                    # Architecture, PRD, API & Deployment guides
├── vercel.json              # Monorepo root deployment configuration
└── README.md
```

---

## ✅ Roadmap & Progress

- [x] Project setup & architecture specification (`docs/`)
- [x] Phase 1: Auth & Database schema migrations (Supabase + Neon DB)
- [x] Phase 2: Upload pipeline (Cloudflare Stream + resumable `tus-js-client`)
- [x] Phase 3: Payments & DRM (Stripe Connect Express + 85/15 fee split)
- [x] Phase 4: Discovery, Browse Catalog & Filmmaker Profiles
- [x] Phase 5: Analytics, Studio Dashboard & Mobile/Tablet Responsive UI
- [x] Phase 6: Production Launch on Vercel 🚀

---

## 💰 Revenue Model

| Item | Amount |
|---|---|
| Average film price | $8 Buy / $4 Rent |
| Platform revenue cut | 15% |
| Filmmaker revenue cut | 85% |
| Upfront cost | $0 |

---

## 📄 License

MIT © [FilmDrop](https://web-mu-one-15.vercel.app)
