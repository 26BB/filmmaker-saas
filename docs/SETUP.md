# Development Setup

## Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account (free tier OK for dev)
- Cloudflare account (Stream product enabled)
- Stripe account (Connect enabled)
- Resend account (free tier: 3,000 emails/mo)
- Vercel account (for deployment)

---

## Environment Variables

Create `apps/web/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_STREAM_API_TOKEN=your-api-token
CLOUDFLARE_STREAM_SIGNING_KEY=your-signing-key

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@filmdrop.io

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PLATFORM_FEE_PERCENT=15
```

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/26BB/filmmaker-saas.git
cd filmmaker-saas/apps/web

# 2. Install
npm install

# 3. Copy env
cp .env.example .env.local
# Fill in all values above

# 4. Push DB schema
npx supabase db push
# OR paste supabase/migrations/001_initial_schema.sql in Supabase SQL editor

# 5. Run
npm run dev
# -> http://localhost:3000
```

---

## Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Run migrations:
   - Option A: `npx supabase db push` (requires Supabase CLI)
   - Option B: Paste `supabase/migrations/001_initial_schema.sql` in SQL Editor
3. Enable **Google OAuth**: Authentication > Providers > Google
4. Set **Site URL**: `http://localhost:3000` (dev) / `https://filmdrop.io` (prod)
5. Set **Redirect URLs**: `http://localhost:3000/**`

---

## Stripe Setup

1. Enable **Stripe Connect** in your dashboard
2. Set platform to **Express accounts** (simplest for filmmakers)
3. Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `account.updated`
4. Note your `STRIPE_WEBHOOK_SECRET` from the webhook endpoint page

---

## Cloudflare Stream Setup

1. Enable **Stream** in Cloudflare dashboard
2. Create API Token: Profile > API Tokens > Create Token
   - Permission: `Stream:Edit`
3. Generate signing key: Stream > Signing Keys > Generate Key
4. Note your `CLOUDFLARE_ACCOUNT_ID` from the Stream overview page
5. Add webhook endpoint: `https://your-domain.com/api/webhooks/cloudflare`
   - Event: `stream.video.ready`, `stream.video.errored`

---

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# (repeat for all env vars)

# Redeploy with env
vercel --prod
```
