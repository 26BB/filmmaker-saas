# FilmDrop — Production Vercel & Cloud Deployment Guide

## 1. Prerequisites
- **GitHub Repository**: Push the `filmmaker-saas` project to a public or private GitHub repository.
- **Vercel Account**: [vercel.com](https://vercel.com)
- **Supabase / Neon Postgres Project**: [supabase.com](https://supabase.com) / [neon.tech](https://neon.tech)
- **Firebase Project**: [firebase.google.com](https://firebase.google.com) (Optional for Analytics & FCM)
- **Cloudflare Stream**: [cloudflare.com](https://cloudflare.com) (4K Video Hosting & Signed DRM Token Playback)
- **Stripe Account**: [stripe.com](https://stripe.com) (Stripe Connect Express destination charges)
- **Resend Account**: [resend.com](https://resend.com) (Transactional Email Notifications)

---

## 2. Environment Variables Matrix

Set these variables in the **Vercel Project Dashboard** under **Settings > Environment Variables**:

| Variable Name | Environment | Description / Example |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All (Prod/Preview/Dev) | `https://<your-project-id>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Supabase Public Anonymous API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | Supabase Admin Service Role Secret |
| `DATABASE_URL` | Production, Preview | `postgresql://user:password@ep-cool-pooler.neon.tech/neondb` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | All | `pk_live_...` or `pk_test_...` |
| `STRIPE_SECRET_KEY` | Production, Preview | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Production, Preview | `whsec_...` from Stripe Dashboard |
| `CLOUDFLARE_ACCOUNT_ID` | Production, Preview | Cloudflare Account ID |
| `CLOUDFLARE_API_TOKEN` | Production, Preview | Cloudflare Stream Edit API Token |
| `CLOUDFLARE_STREAM_KEY_ID` | Production, Preview | Signing Key ID for playback URLs |
| `CLOUDFLARE_STREAM_JWK_KEY` | Production, Preview | Private JWK / PEM key |
| `RESEND_API_KEY` | Production, Preview | `re_...` Resend API Key |
| `RESEND_FROM_EMAIL` | All | `FilmDrop <notifications@yourdomain.com>` |
| `NEXT_PUBLIC_APP_URL` | All | `https://filmdrop.app` or `https://<your-vercel-domain>.vercel.app` |

---

## 3. Vercel Project Import Settings
1. Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New > Project**.
2. Select your `filmmaker-saas` GitHub repository (`26BB/filmmaker-saas`).
3. Configure the **Framework Preset**: `Next.js`.
4. Configure **Root Directory**: `apps/web` (or leave as root `/` with root `vercel.json`).
5. In **Build and Output Settings**:
   - Build Command: `next build` (or default)
   - Output Directory: `.next` (or default)
   - Install Command: `npm install`
6. Paste all Environment Variables into the input panel.
7. Click **Deploy**.
