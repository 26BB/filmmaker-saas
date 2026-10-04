-- 🎬 FilmDrop Supabase Initial Schema & RLS Policies
-- Migration: 20261004000000_init_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  is_filmmaker BOOLEAN DEFAULT FALSE,
  stripe_account_id TEXT,
  stripe_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Films Table
CREATE TABLE IF NOT EXISTS public.films (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filmmaker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_cf_uid TEXT,
  cf_video_uid TEXT,
  duration_seconds INTEGER,
  release_year INTEGER,
  genres TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'en',
  country TEXT,
  director TEXT,
  buy_price_cents INTEGER,
  rent_price_cents INTEGER,
  rent_duration_hours INTEGER DEFAULT 48,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  total_views INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  total_revenue_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Films
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;

-- Films RLS Policies
CREATE POLICY "Published films are viewable by everyone" 
  ON public.films FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Filmmakers can view all their own films" 
  ON public.films FOR SELECT 
  USING (auth.uid() = filmmaker_id);

CREATE POLICY "Filmmakers can insert their own films" 
  ON public.films FOR INSERT 
  WITH CHECK (auth.uid() = filmmaker_id);

CREATE POLICY "Filmmakers can update their own films" 
  ON public.films FOR UPDATE 
  USING (auth.uid() = filmmaker_id);

CREATE POLICY "Filmmakers can delete their own films" 
  ON public.films FOR DELETE 
  USING (auth.uid() = filmmaker_id);

-- 3. Purchases Table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'rent')),
  amount_paid_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL,
  filmmaker_payout_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_transfer_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Purchases RLS Policies
CREATE POLICY "Viewers can view their own purchases" 
  ON public.purchases FOR SELECT 
  USING (auth.uid() = viewer_id);

CREATE POLICY "Filmmakers can view purchases of their own films" 
  ON public.purchases FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.films 
    WHERE films.id = purchases.film_id AND films.filmmaker_id = auth.uid()
  ));

-- 4. Watch Sessions Table
CREATE TABLE IF NOT EXISTS public.watch_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  watch_duration_seconds INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(viewer_id, film_id)
);

-- Enable RLS on Watch Sessions
ALTER TABLE public.watch_sessions ENABLE ROW LEVEL SECURITY;

-- Watch Sessions RLS Policies
CREATE POLICY "Viewers can view and modify their own watch sessions" 
  ON public.watch_sessions FOR ALL 
  USING (auth.uid() = viewer_id);

-- Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_films_slug ON public.films(slug);
CREATE INDEX IF NOT EXISTS idx_films_filmmaker ON public.films(filmmaker_id);
CREATE INDEX IF NOT EXISTS idx_films_status ON public.films(status);
CREATE INDEX IF NOT EXISTS idx_purchases_viewer ON public.purchases(viewer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_film ON public.purchases(film_id);
CREATE INDEX IF NOT EXISTS idx_purchases_entitlement ON public.purchases(viewer_id, film_id, expires_at);

-- Trigger: Automatically create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
