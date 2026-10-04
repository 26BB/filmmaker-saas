import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createDashboardLoginLink } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_account_id, stripe_onboarded')
        .eq('id', user.id)
        .single();

      if (profile?.stripe_account_id) {
        try {
          const loginLink = await createDashboardLoginLink(profile.stripe_account_id);
          return NextResponse.json({ url: loginLink.url });
        } catch (linkErr) {
          console.warn('Could not create Stripe login link:', linkErr);
        }
      }
    }

    return NextResponse.json({ url: 'https://dashboard.stripe.com/express' });
  } catch (error: any) {
    console.error('Stripe dashboard link error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate Stripe dashboard link' },
      { status: 500 }
    );
  }
}
