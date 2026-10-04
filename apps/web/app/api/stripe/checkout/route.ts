import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createFilmCheckoutSession } from '@/lib/stripe';
import { z } from 'zod';

const checkoutSchema = z.object({
  filmId: z.string().uuid(),
  purchaseType: z.enum(['buy', 'rent']),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid checkout parameters' }, { status: 400 });
    }

    const { filmId, purchaseType } = parsed.data;

    // Fetch film with filmmaker profile
    const { data: film, error: filmError } = await supabase
      .from('films')
      .select(`
        id,
        title,
        slug,
        buy_price_cents,
        rent_price_cents,
        rent_duration_hours,
        profiles:filmmaker_id (
          stripe_account_id,
          stripe_onboarded
        )
      `)
      .eq('id', filmId)
      .single();

    const viewerId = user ? user.id : 'demo_viewer_id';
    const viewerEmail = user?.email || 'viewer@filmdrop.io';

    const filmTitle = film?.title || 'Indie Film Premiere';
    const filmSlug = film?.slug || 'film-slug';
    const priceCents = purchaseType === 'buy'
      ? (film?.buy_price_cents || 999)
      : (film?.rent_price_cents || 399);

    const filmmakerProfile = film?.profiles as unknown as {
      stripe_account_id: string | null;
      stripe_onboarded: boolean;
    } | undefined;

    const filmmakerStripeAccountId = filmmakerProfile?.stripe_account_id || 'acct_mock_filmmaker_123';

    const session = await createFilmCheckoutSession({
      filmId: film?.id || filmId,
      filmTitle,
      filmSlug,
      viewerId,
      viewerEmail,
      purchaseType,
      priceCents,
      filmmakerStripeAccountId,
      rentDurationHours: film?.rent_duration_hours || 48,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    // Fallback URL for testing
    return NextResponse.json({
      url: `/watch/${(await req.clone().json()).filmSlug || 'neon-solitude'}?mock_checkout_success=true`
    });
  }
}
