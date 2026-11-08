import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amountInr,
      filmId,
      filmTitle,
      filmSlug,
      viewerId,
      viewerEmail,
      purchaseType = 'buy',
      rentDurationHours = 48,
      filmmakerBankOrAccountId,
    } = body;

    // Input sanitization & validation
    if (!amountInr || Number(amountInr) <= 0) {
      return NextResponse.json(
        { error: 'Valid amount in INR is required' },
        { status: 400 }
      );
    }

    if (!filmId || !filmSlug || !viewerId || !viewerEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters: filmId, filmSlug, viewerId, viewerEmail' },
        { status: 400 }
      );
    }

    const order = await createRazorpayOrder({
      amountInr: Number(amountInr),
      filmId,
      filmTitle: filmTitle || filmSlug,
      filmSlug,
      viewerId,
      viewerEmail,
      purchaseType,
      rentDurationHours: Number(rentDurationHours),
      filmmakerBankOrAccountId,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      notes: order.notes,
    });
  } catch (error: any) {
    console.error('[API /api/razorpay/order] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error creating Razorpay order' },
      { status: 500 }
    );
  }
}
