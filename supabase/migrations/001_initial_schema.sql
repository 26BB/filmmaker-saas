-- =============================================================================
-- FilmDrop: 001_initial_schema.sql
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE film_status AS ENUM ('draft', 'processing', 'published', 'unpublished');
CREATE TYPE purchase_type AS ENUM ('buy', 'rent');
CREATE TYPE payout_status AS ENUM ('pending', 'paid', 'failed');

-- -----------------------------------------------------------------------------
-- 1. Profiles Table (extends auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name        TEXT,
  bio                 TEXT,
  avatar_url          TEXT,
  website_url         TEXT,
  is_filmmaker        BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_account_id   TEXT,
  stripe_onboarded    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. Films Table
-- -----------------------------------------------------------------------------
CREATE TABLE films (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filmmaker_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug                TEXT UNIQUE NOT NULL,
  title               TEXT NOT NULL,
  tagline             TEXT,
  description         TEXT,
  genre               TEXT[] DEFAULT '{}',
  duration_seconds    INT,
  release_year        INT,
  country             TEXT,
  language            TEXT,
  status              film_status NOT NULL DEFAULT 'draft',
  cf_video_uid        TEXT,
  cf_trailer_uid      TEXT,
  thumbnail_url       TEXT,
  buy_price_cents     INT,
  rent_price_cents    INT,
  rent_duration_hours INT NOT NULL DEFAULT 48,
  total_views         INT NOT NULL DEFAULT 0,
  total_purchases     INT NOT NULL DEFAULT 0,
  total_revenue_cents BIGINT NOT NULL DEFAULT 0,
  meta_description    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. Purchases Table
-- -----------------------------------------------------------------------------
CREATE TABLE purchases (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id               UUID REFERENCES profiles(id) ON DELETE SET NULL,
  film_id                 UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  purchase_type           purchase_type NOT NULL,
  amount_cents            INT NOT NULL,
  platform_fee_cents      INT NOT NULL,
  filmmaker_amount_cents  INT NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_transfer_id      TEXT,
  expires_at              TIMESTAMPTZ,
  payout_status           payout_status NOT NULL DEFAULT 'pending',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. Watch Sessions Table
-- -----------------------------------------------------------------------------
CREATE TABLE watch_sessions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id               UUID REFERENCES profiles(id) ON DELETE SET NULL,
  film_id                 UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  purchase_id             UUID REFERENCES purchases(id) ON DELETE SET NULL,
  watch_duration_seconds  INT NOT NULL DEFAULT 0,
  completed               BOOLEAN NOT NULL DEFAULT FALSE,
  started_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Performance Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX idx_films_filmmaker_id ON films(filmmaker_id);
CREATE INDEX idx_films_status ON films(status);
CREATE INDEX idx_films_slug ON films(slug);
CREATE INDEX idx_purchases_viewer_film ON purchases(viewer_id, film_id);
CREATE INDEX idx_purchases_stripe_pi ON purchases(stripe_payment_intent_id);
CREATE INDEX idx_watch_sessions_viewer_film ON watch_sessions(viewer_id, film_id);

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE films ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view basic profile info, user can update own profile
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_user_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_user_insert" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Films: Public can read published films
CREATE POLICY "published_films_public" ON films
  FOR SELECT USING (status = 'published');

-- Films: Filmmaker can CRUD their own films
CREATE POLICY "filmmaker_owns_film" ON films
  FOR ALL USING (filmmaker_id = auth.uid());

-- Purchases: Viewer reads their own purchases
CREATE POLICY "viewer_sees_own_purchases" ON purchases
  FOR SELECT USING (viewer_id = auth.uid());

-- Purchases: Filmmaker reads purchases of their films
CREATE POLICY "filmmaker_sees_film_purchases" ON purchases
  FOR SELECT USING (
    film_id IN (SELECT id FROM films WHERE filmmaker_id = auth.uid())
  );

-- Purchases: Insert via service role / backend API
CREATE POLICY "service_role_purchases_insert" ON purchases
  FOR INSERT WITH CHECK (true);

-- Watch Sessions: Viewers can create and manage their own sessions
CREATE POLICY "viewer_watch_sessions" ON watch_sessions
  FOR ALL USING (viewer_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Triggers & Automation
-- -----------------------------------------------------------------------------
-- Auto-create profile on new auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, is_filmmaker)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'is_filmmaker')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_films_updated_at
  BEFORE UPDATE ON films
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
