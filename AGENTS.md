# AGENTS.md — FilmDrop Project Rules

This file is read by all AI agents working on this codebase. Rules here are **mandatory** and apply to every task: PRDs, MVPs, architecture decisions, copy, pricing, feature prioritisation, and code.

---

## 🇮🇳 India-First Context Rule

**Always apply Indian regional context** when producing any output for this project. This includes (but is not limited to):

### Product & PRD
- Default currency display: **Indian Rupee (₹ / INR)**. Show USD as secondary where relevant.
- Payment methods to consider: **UPI, Razorpay, Paytm, PhonePe, net banking, EMI on cards** — not just Stripe/credit cards.
- Pricing benchmarks in Indian market terms (e.g., ₹99–₹499 for film rentals, not $4–$8).
- Localisation: Hindi as a primary language alongside English for UI copy suggestions.
- Consider **low-bandwidth scenarios**: many Indian users are on mobile data (4G/5G but variable). Adaptive streaming bitrates matter.
- Feature prioritisation must account for **mobile-first**: majority of Indian internet users are on Android phones, not desktop.
- Regulatory: be aware of **FEMA, RBI payment regulations**, GST (18% on digital services), and data localisation requirements.

### Architecture & Infrastructure
- Preferred Indian cloud regions: **AWS ap-south-1 (Mumbai)**, GCP asia-south1, Azure Central India.
- Cloudflare PoPs with good Indian coverage: Mumbai, Chennai, Hyderabad — note this in latency decisions.
- Consider **Supabase** self-hosted or region selection closest to India if latency is a concern.

### Payments
- **MVP target payment stack**: Razorpay (primary for India) + Stripe (for international/USD). Do not assume Stripe is the only option.
- Filmmaker payouts in India: NEFT/IMPS bank transfers via Razorpay, not just Stripe Connect.
- GST implications: platform must issue GST-compliant invoices for Indian customers.

### Market & Competitive Context
- Indian OTT market: Netflix, Prime Video, Hotstar, ZEE5, SonyLIV, MX Player dominate. FilmDrop is positioned as a **creator-first TVOD tool**, not a subscription service.
- Indie filmmaker communities in India: **MAMI, NFDC, Film Companion, YouTube indie creators**.
- Vimeo On Demand had limited Indian adoption — our opportunity is fresh: reach Indian indie filmmakers who never had a clean TVOD option.
- Typical Indian indie film pricing: ₹49–₹199 buy, ₹29–₹99 rent. Adjust default price suggestions accordingly.

### Copy & UX
- Date formats: DD/MM/YYYY for Indian audiences.
- Phone number format: +91 prefix, 10-digit mobile numbers.
- Address fields: include Pincode (not ZIP), State dropdown with Indian states.
- WhatsApp is a primary communication channel — consider WhatsApp notifications as a v2 feature.

---

## General Rules

- **No premature abstraction**: build the simplest thing that works first.
- **Mobile-first**: design and implement for small screens before desktop.
- **Revenue split**: always 85% filmmaker / 15% platform. Do not change without explicit instruction.
- **DRM for MVP**: Cloudflare signed URLs only (2hr expiry). Widevine/FairPlay is v2.
- **Upload limit**: 2 GB/film for MVP.
- **Stack**: Next.js 15 App Router · Supabase · Cloudflare Stream · Razorpay (India) + Stripe (international) · Tailwind + shadcn/ui · Vercel.
- **🏢 Agent Hub Office & Continuous Memory**: Every multi-agent session MUST maintain the live communication board at `docs/AGENTS_HUB.md` and record operational learnings and heuristics in `AGENTS_MEMORY.md`. All subagents (builders, testers, fixers) communicate and cross-verify before committing.

---

## Region Flag Quick Reference

| Dimension | India Default | International Default |
|-----------|--------------|----------------------|
| Currency | ₹ INR | $ USD |
| Payment | Razorpay / UPI | Stripe |
| Language | Hindi + English | English |
| Cloud region | ap-south-1 (Mumbai) | us-east-1 |
| Film rent price | ₹49–₹99 | $3–$5 |
| Film buy price | ₹199–₹499 | $8–$15 |
| Tax | 18% GST | Varies |
| Device | Android mobile | Desktop/any |
