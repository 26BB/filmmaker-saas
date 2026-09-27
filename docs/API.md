# API Reference

## Upload Endpoints

### `POST /api/upload/initiate`
Generates a Cloudflare Stream tus upload URL for direct browser-to-Cloudflare upload.

**Auth**: Filmmaker required

**Request**
```json
{
  "filmId": "uuid",
  "fileName": "film.mp4",
  "fileSizeBytes": 1073741824
}
```

**Response**
```json
{
  "uploadUrl": "https://upload.videodelivery.net/tus/...",
  "videoUid": "abc123"
}
```

---

## Stream Endpoints

### `POST /api/stream/signed-url`
Server validates purchase, returns time-limited Cloudflare signed playback URL.

**Auth**: Viewer required

**Request**
```json
{ "filmSlug": "my-short-film" }
```

**Response**
```json
{
  "signedUrl": "https://customer-xyz.cloudflarestream.com/...",
  "expiresAt": "2026-09-27T20:00:00Z"
}
```

**Errors**
- `401` Not authenticated
- `403` No valid purchase / rental expired
- `404` Film not found

---

## Webhook Endpoints

### `POST /api/webhooks/stripe`

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Create purchase row, send confirmation email |
| `account.updated` | Update `stripe_onboarded = true` on profiles |

### `POST /api/webhooks/cloudflare`

| Event | Action |
|-------|--------|
| `stream.video.ready` | Update film status: processing -> published |
| `stream.video.errored` | Update film status to error, notify filmmaker |

---

## Stripe Connect Flow

```
1. Filmmaker clicks "Connect Stripe"
2. POST /api/stripe/connect/create-account
   -> Stripe creates Express account
   -> Store stripe_account_id in profiles
3. Redirect filmmaker to Stripe onboarding URL
4. Stripe webhooks: account.updated -> stripe_onboarded = true
5. Filmmaker can now receive payouts
```

## Payment Flow (Destination Charge)

```
1. Viewer clicks "Buy for $8"
2. POST /api/stripe/checkout
   -> Create Stripe Checkout Session
   -> payment_intent_data.application_fee_amount = price * 0.15
   -> payment_intent_data.transfer_data.destination = filmmaker.stripe_account_id
3. Viewer completes Stripe Checkout
4. Webhook: payment_intent.succeeded
   -> INSERT INTO purchases
   -> Send confirmation email (Resend)
5. Filmmaker sees earnings in their Stripe Express dashboard
```

## Signed URL Flow (Access Control)

```
1. Viewer lands on /watch/[slug]
2. Middleware checks: is user authenticated? has purchase? is rental valid?
   -> No: redirect to /film/[slug] with ?buy=true
   -> Yes: proceed
3. Page calls POST /api/stream/signed-url
4. Server: SELECT purchase FROM purchases WHERE viewer_id = uid
          AND film_id = film.id AND (expires_at IS NULL OR expires_at > NOW())
5. If found: call Cloudflare API to create signed token (2hr expiry)
6. Return signed URL to client
7. Cloudflare player uses signed URL -- expires 2hr later
```
