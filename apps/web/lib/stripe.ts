import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key_filmdrop', {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
});

const PLATFORM_FEE_PERCENT = 0.15; // 15% platform cut

export function calculatePlatformFee(amountCents: number): {
  platformFeeCents: number;
  filmmakerAmountCents: number;
} {
  const platformFeeCents = Math.round(amountCents * PLATFORM_FEE_PERCENT);
  const filmmakerAmountCents = amountCents - platformFeeCents;
  return { platformFeeCents, filmmakerAmountCents };
}

export async function createFilmCheckoutSession({
  filmId,
  filmTitle,
  filmSlug,
  viewerId,
  viewerEmail,
  purchaseType,
  priceCents,
  filmmakerStripeAccountId,
  rentDurationHours = 48,
}: {
  filmId: string;
  filmTitle: string;
  filmSlug: string;
  viewerId: string;
  viewerEmail: string;
  purchaseType: 'buy' | 'rent';
  priceCents: number;
  filmmakerStripeAccountId: string;
  rentDurationHours?: number;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const { platformFeeCents } = calculatePlatformFee(priceCents);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: viewerEmail,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: priceCents,
          product_data: {
            name: `${filmTitle} (${purchaseType === 'buy' ? 'Lifetime Purchase' : `${rentDurationHours}h Rental`})`,
            description: purchaseType === 'buy'
              ? `Own and stream ${filmTitle} anytime on FilmDrop.`
              : `Stream ${filmTitle} for ${rentDurationHours} hours.`,
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformFeeCents,
      transfer_data: {
        destination: filmmakerStripeAccountId,
      },
      metadata: {
        filmId,
        filmSlug,
        viewerId,
        purchaseType,
        rentDurationHours: rentDurationHours.toString(),
      },
    },
    metadata: {
      filmId,
      filmSlug,
      viewerId,
      purchaseType,
      rentDurationHours: rentDurationHours.toString(),
    },
    success_url: `${appUrl}/watch/${filmSlug}?session_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel_url: `${appUrl}/film/${filmSlug}?canceled=true`,
  });

  return session;
}

export async function createConnectAccount(userId: string, email: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      transfers: { requested: true },
      card_payments: { requested: true },
    },
    metadata: {
      userId,
    },
  });

  return account;
}

export async function createAccountLink(accountId: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/dashboard/payouts?stripe_refresh=true`,
    return_url: `${appUrl}/dashboard/payouts?stripe_onboarded=true`,
    type: 'account_onboarding',
  });
}

export async function createDashboardLoginLink(accountId: string) {
  return await stripe.accounts.createLoginLink(accountId);
}
