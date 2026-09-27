# Database Schema

## Enums

```sql
CREATE TYPE film_status AS ENUM ('draft', 'processing', 'published', 'unpublished');
CREATE TYPE purchase_type AS ENUM ('buy', 'rent');
CREATE TYPE payout_status AS ENUM ('pending', 'paid', 'failed');
```

---

## `profiles`
Extends `auth.users`. Stores filmmaker Stripe Connect ID.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | refs auth.users |
| display_name | TEXT | |
| bio | TEXT | |
| avatar_url | TEXT | |
| website_url | TEXT | |
| is_filmmaker | BOOLEAN | default false |
| stripe_account_id | TEXT | Stripe Connect Express ID |
| stripe_onboarded | BOOLEAN | Connect onboarding complete |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

## `films`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| filmmaker_id | UUID FK | refs profiles |
| slug | TEXT UNIQUE | URL-safe identifier |
| title | TEXT | |
| tagline | TEXT | One-liner |
| description | TEXT | |
| genre | TEXT[] | ['drama', 'documentary'] |
| duration_seconds | INT | |
| release_year | INT | |
| country | TEXT | |
| language | TEXT | |
| status | film_status | draft/processing/published/unpublished |
| cf_video_uid | TEXT | Cloudflare Stream video UID |
| cf_trailer_uid | TEXT | Cloudflare Stream trailer UID |
| thumbnail_url | TEXT | |
| buy_price_cents | INT | NULL = free |
| rent_price_cents | INT | NULL = no rental option |
| rent_duration_hours | INT | default 48 |
| total_views | INT | denormalized counter |
| total_purchases | INT | denormalized counter |
| total_revenue_cents | BIGINT | denormalized |
| meta_description | TEXT | SEO |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

## `purchases`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| viewer_id | UUID FK | refs profiles (nullable on delete) |
| film_id | UUID FK | refs films |
| purchase_type | purchase_type | buy / rent |
| amount_cents | INT | Total paid by viewer |
| platform_fee_cents | INT | 15% of amount |
| filmmaker_amount_cents | INT | 85% of amount |
| stripe_payment_intent_id | TEXT UNIQUE | |
| stripe_transfer_id | TEXT | |
| expires_at | TIMESTAMPTZ | NULL = permanent buy; set for rentals |
| payout_status | payout_status | pending / paid / failed |
| created_at | TIMESTAMPTZ | |

---

## `watch_sessions`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| viewer_id | UUID FK | |
| film_id | UUID FK | |
| purchase_id | UUID FK | |
| watch_duration_seconds | INT | How long they watched |
| completed | BOOLEAN | Watched >= 90% |
| started_at | TIMESTAMPTZ | |

---

## RLS Policies

```sql
-- Films: public can read published films
CREATE POLICY "published_films_public" ON films
  FOR SELECT USING (status = 'published');

-- Filmmaker can CRUD their own films
CREATE POLICY "filmmaker_owns_film" ON films
  FOR ALL USING (filmmaker_id = auth.uid());

-- Viewer reads their own purchases
CREATE POLICY "viewer_sees_own_purchases" ON purchases
  FOR SELECT USING (viewer_id = auth.uid());

-- Filmmaker reads purchases of their films
CREATE POLICY "filmmaker_sees_film_purchases" ON purchases
  FOR SELECT USING (
    film_id IN (SELECT id FROM films WHERE filmmaker_id = auth.uid())
  );

-- Viewers create/read their own watch sessions
CREATE POLICY "viewer_watch_sessions" ON watch_sessions
  FOR ALL USING (viewer_id = auth.uid());
```

---

## Full Migration SQL

```sql
-- supabase/migrations/001_initial_schema.sql

CREATE TYPE film_status AS ENUM ('draft', 'processing', 'published', 'unpublished');
CREATE TYPE purchase_type AS ENUM ('buy', 'rent');
CREATE TYPE payout_status AS ENUM ('pending', 'paid', 'failed');

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  website_url     TEXT,
  is_filmmaker    BOOLEAN DEFAULT FALSE,
  stripe_account_id TEXT,
  stripe_onboarded  BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE films (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filmmaker_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  tagline         TEXT,
  description     TEXT,
  genre           TEXT[],
  duration_seconds INT,
  release_year    INT,
  country         TEXT,
  language        TEXT,
  status          film_status DEFAULT 'draft',
  cf_video_uid    TEXT,
  cf_trailer_uid  TEXT,
  thumbnail_url   TEXT,
  buy_price_cents  INT,
  rent_price_cents INT,
  rent_duration_hours INT DEFAULT 48,
  total_views     INT DEFAULT 0,
  total_purchases INT DEFAULT 0,
  total_revenue_cents BIGINT DEFAULT 0,
  meta_description TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  film_id         UUID REFERENCES films(id) ON DELETE CASCADE,
  purchase_type   purchase_type NOT NULL,
  amount_cents    INT NOT NULL,
  platform_fee_cents INT NOT NULL,
  filmmaker_amount_cents INT NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_transfer_id  TEXT,
  expires_at      TIMESTAMPTZ,
  payout_status   payout_status DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE watch_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  film_id         UUID REFERENCES films(id) ON DELETE CASCADE,
  purchase_id     UUID REFERENCES purchases(id),
  watch_duration_seconds INT DEFAULT 0,
  completed       BOOLEAN DEFAULT FALSE,
  started_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE films ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "published_films_public" ON films
  FOR SELECT USING (status = 'published');

CREATE POLICY "filmmaker_owns_film" ON films
  FOR ALL USING (filmmaker_id = auth.uid());

CREATE POLICY "viewer_sees_own_purchases" ON purchases
  FOR SELECT USING (viewer_id = auth.uid());

CREATE POLICY "filmmaker_sees_film_purchases" ON purchases
  FOR SELECT USING (
    film_id IN (SELECT id FROM films WHERE filmmaker_id = auth.uid())
  );

CREATE POLICY "viewer_watch_sessions" ON watch_sessions
  FOR ALL USING (viewer_id = auth.uid());

-- Trigger: update profiles.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_films_updated_at
  BEFORE UPDATE ON films
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
