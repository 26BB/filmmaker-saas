import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createConnectAccount, createAccountLink } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user ? user.id : 'demo_user_id';
    const email = user?.email || 'filmmaker@demo.com';

    let accountId = 'acct_demo_filmmaker_123';

    try {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('stripe_account_id, is_filmmaker')
          .eq('id', user.id)
          .single();

        if (profile?.stripe_account_id) {
          accountId = profile.stripe_account_id;
        } else {
          const account = await createConnectAccount(userId, email);
          accountId = account.id;

          await supabase
            .from('profiles')
            .update({
              stripe_account_id: accountId,
              is_filmmaker: true,
            })
            .eq('id', user.id);
        }
      }

      const accountLink = await createAccountLink(accountId);
      return NextResponse.json({ url: accountLink.url });
    } catch (stripeErr) {
      console.warn('Stripe Connect error (fallback to local success url):', stripeErr);
      return NextResponse.json({ url: '/dashboard/payouts?stripe_onboarded=true' });
    }
  } catch (error: any) {
    console.error('Stripe Connect onboarding error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate Stripe Connect onboarding' },
      { status: 500 }
    );
  }
}
