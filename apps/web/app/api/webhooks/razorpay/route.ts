import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature, calculatePlatformFeeInr } from '@/lib/razorpay';
import { createAdminClient } from '@/lib/supabase/server';
import { sendPurchaseConfirmationEmail, sendFilmmakerPayoutAlert } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  if (!signature && process.env.RAZORPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
  }

  // Cryptographic signature check if webhook secret configured
  if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
    const isValid = verifyRazorpayWebhookSignature({
      rawPayload: bodyText,
      signature,
    });

    if (!isValid) {
      console.warn('Razorpay webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }
  }

  let eventData: any;
  try {
    eventData = JSON.parse(bodyText);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const adminSupabase = createAdminClient();

  try {
    const event = eventData.event;

    if (event === 'order.paid' || event === 'payment.captured') {
      const payment = eventData.payload?.payment?.entity;
      const order = eventData.payload?.order?.entity;
      const notes = payment?.notes || order?.notes || {};

      if (!notes.filmId || !notes.viewerId) {
        console.warn('Razorpay webhook received without expected film notes');
        return NextResponse.json({ received: true });
      }

      const filmId = notes.filmId;
      const viewerId = notes.viewerId;
      const filmSlug = notes.filmSlug || '';
      const purchaseType = (notes.purchaseType as 'buy' | 'rent') || 'buy';
      const rentDurationHours = parseInt(notes.rentDurationHours || '48', 10);
      const amountPaise = payment?.amount || order?.amount || 0;
      const amountInr = amountPaise / 100;

      const split = calculatePlatformFeeInr(amountInr);

      const expiresAt = purchaseType === 'rent'
        ? new Date(Date.now() + rentDurationHours * 3600 * 1000).toISOString()
        : null;

      // 1. Record purchase
      const { error: insertError } = await adminSupabase.from('purchases').insert({
        viewer_id: viewerId,
        film_id: filmId,
        purchase_type: purchaseType,
        amount_cents: amountPaise, // stored in smallest currency unit (paise)
        platform_fee_cents: split.platformFeePaise,
        filmmaker_amount_cents: split.filmmakerPayoutPaise,
        stripe_payment_intent_id: payment?.id || order?.id || `rzp_${Date.now()}`,
        expires_at: expiresAt,
        payout_status: 'paid',
      });

      if (insertError) {
        console.error('Failed to insert Razorpay purchase record:', insertError);
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
            total_revenue_cents: (film.total_revenue_cents || 0) + amountPaise,
          })
          .eq('id', filmId);

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const watchUrl = `${appUrl}/watch/${filmSlug}`;

        const viewerEmail = notes.viewerEmail || payment?.email;
        if (viewerEmail) {
          await sendPurchaseConfirmationEmail({
            to: viewerEmail,
            filmTitle: film.title,
            amountCents: amountPaise,
            purchaseType,
            watchUrl,
            expiresAt,
          });
        }

        try {
          const { data: filmmakerUser } = await adminSupabase.auth.admin.getUserById(film.filmmaker_id);
          if (filmmakerUser?.user?.email) {
            await sendFilmmakerPayoutAlert({
              to: filmmakerUser.user.email,
              filmTitle: film.title,
              filmmakerAmountCents: split.filmmakerPayoutPaise,
              purchaseType,
            });
          }
        } catch (e) {
          // Catch user fetch errors
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Razorpay webhook processing error:', err);
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }
}
