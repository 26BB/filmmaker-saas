import { NextRequest, NextResponse } from 'next/server';
import { stripe, calculatePlatformFee } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { sendPurchaseConfirmationEmail, sendFilmmakerPayoutAlert } from '@/lib/resend';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        bodyText,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = JSON.parse(bodyText);
    }
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const adminSupabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (!metadata || !metadata.filmId || !metadata.viewerId) {
          console.warn('Checkout session completed without expected metadata:', session.id);
          break;
        }

        const filmId = metadata.filmId;
        const viewerId = metadata.viewerId;
        const filmSlug = metadata.filmSlug || '';
        const purchaseType = (metadata.purchaseType as 'buy' | 'rent') || 'buy';
        const rentDurationHours = parseInt(metadata.rentDurationHours || '48', 10);
        const amountCents = session.amount_total || 0;

        const { platformFeeCents, filmmakerAmountCents } = calculatePlatformFee(amountCents);

        const expiresAt = purchaseType === 'rent'
          ? new Date(Date.now() + rentDurationHours * 3600 * 1000).toISOString()
          : null;

        // 1. Record purchase
        const { error: insertError } = await adminSupabase.from('purchases').insert({
          viewer_id: viewerId,
          film_id: filmId,
          purchase_type: purchaseType,
          amount_cents: amountCents,
          platform_fee_cents: platformFeeCents,
          filmmaker_amount_cents: filmmakerAmountCents,
          stripe_payment_intent_id: (session.payment_intent as string) || session.id,
          expires_at: expiresAt,
          payout_status: 'paid',
        });

        if (insertError) {
          console.error('Failed to insert purchase record:', insertError);
        }

        // 2. Increment counters on film
        const { data: film } = await adminSupabase
          .from('films')
          .select('title, total_purchases, total_revenue_cents, filmmaker_id')
          .eq('id', filmId)
          .single();

        if (film) {
          await adminSupabase
            .from('films')
            .update({
              total_purchases: (film.total_purchases || 0) + 1,
              total_revenue_cents: (film.total_revenue_cents || 0) + amountCents,
            })
            .eq('id', filmId);

          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const watchUrl = `${appUrl}/watch/${filmSlug}`;

          // 3. Email notifications
          if (session.customer_details?.email) {
            await sendPurchaseConfirmationEmail({
              to: session.customer_details.email,
              filmTitle: film.title,
              amountCents,
              purchaseType,
              watchUrl,
              expiresAt,
            });
          }

          // Filmmaker alert
          try {
            const { data: filmmakerUser } = await adminSupabase.auth.admin.getUserById(film.filmmaker_id);
            if (filmmakerUser?.user?.email) {
              await sendFilmmakerPayoutAlert({
                to: filmmakerUser.user.email,
                filmTitle: film.title,
                filmmakerAmountCents,
                purchaseType,
              });
            }
          } catch (e) {
            // User retrieval catch
          }
        }
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        if (account.charges_enabled && account.details_submitted) {
          await adminSupabase
            .from('profiles')
            .update({ stripe_onboarded: true })
            .eq('stripe_account_id', account.id);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook execution error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
