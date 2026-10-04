export type FilmStatus = 'draft' | 'processing' | 'published' | 'unpublished';
export type PurchaseType = 'buy' | 'rent';
export type PayoutStatus = 'pending' | 'paid' | 'failed';

export interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  is_filmmaker: boolean;
  stripe_account_id: string | null;
  stripe_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Film {
  id: string;
  filmmaker_id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  genre: string[];
  duration_seconds: number | null;
  release_year: number | null;
  country: string | null;
  language: string | null;
  status: FilmStatus;
  cf_video_uid: string | null;
  cf_trailer_uid: string | null;
  thumbnail_url: string | null;
  buy_price_cents: number | null;
  rent_price_cents: number | null;
  rent_duration_hours: number;
  total_views: number;
  total_purchases: number;
  total_revenue_cents: number;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Purchase {
  id: string;
  viewer_id: string | null;
  film_id: string;
  purchase_type: PurchaseType;
  amount_cents: number;
  platform_fee_cents: number;
  filmmaker_amount_cents: number;
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  expires_at: string | null;
  payout_status: PayoutStatus;
  created_at: string;
  films?: Film;
}

export interface WatchSession {
  id: string;
  viewer_id: string | null;
  film_id: string;
  purchase_id: string | null;
  watch_duration_seconds: number;
  completed: boolean;
  started_at: string;
}
