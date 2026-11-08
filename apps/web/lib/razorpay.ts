import crypto from 'crypto';

export interface RevenueSplitInr {
  totalAmountInr: number;
  totalAmountPaise: number;
  platformFeeInr: number;
  platformFeePaise: number;
  filmmakerPayoutInr: number;
  filmmakerPayoutPaise: number;
}

export interface CreateRazorpayOrderInput {
  amountInr: number;
  filmId: string;
  filmTitle: string;
  filmSlug: string;
  viewerId: string;
  viewerEmail: string;
  purchaseType: 'buy' | 'rent';
  rentDurationHours?: number;
  filmmakerBankOrAccountId?: string;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number; // in paise
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  notes: Record<string, string>;
  created_at: number;
}

/**
 * Calculates 15% platform cut and 85% filmmaker payout in INR.
 * Strictly calculates in integer paise to guarantee ZERO-PAISA LEAKAGE.
 * Platform fee = Math.round(totalPaise * 0.15)
 * Filmmaker payout = totalPaise - platformFeePaise
 */
export function calculatePlatformFeeInr(amountInr: number): RevenueSplitInr {
  if (amountInr <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  // Convert INR to integer paise (1 INR = 100 paise)
  const totalAmountPaise = Math.round(amountInr * 100);
  
  // 15% platform cut
  const platformFeePaise = Math.round(totalAmountPaise * 0.15);
  
  // Guaranteed zero-paisa leakage: filmmaker receives remainder
  const filmmakerPayoutPaise = totalAmountPaise - platformFeePaise;

  return {
    totalAmountInr: totalAmountPaise / 100,
    totalAmountPaise,
    platformFeeInr: platformFeePaise / 100,
    platformFeePaise,
    filmmakerPayoutInr: filmmakerPayoutPaise / 100,
    filmmakerPayoutPaise,
  };
}

/**
 * Verifies Razorpay HMAC-SHA256 signature using timing-safe comparison.
 */
export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  secret = process.env.RAZORPAY_KEY_SECRET,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  secret?: string;
}): boolean {
  if (!secret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured');
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const generatedBuffer = Buffer.from(generatedSignature, 'utf8');
  const signatureBuffer = Buffer.from(razorpaySignature, 'utf8');

  if (generatedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, signatureBuffer);
}

/**
 * Verifies Razorpay Webhook signature against raw payload.
 */
export function verifyRazorpayWebhookSignature({
  rawPayload,
  signature,
  webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET,
}: {
  rawPayload: string;
  signature: string;
  webhookSecret?: string;
}): boolean {
  if (!webhookSecret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured');
  }

  if (!rawPayload || !signature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawPayload)
    .digest('hex');

  const generatedBuffer = Buffer.from(generatedSignature, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  if (generatedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, signatureBuffer);
}

/**
 * Creates a Razorpay Order via REST API with metadata notes for automated ledger entry.
 */
export async function createRazorpayOrder(
  input: CreateRazorpayOrderInput
): Promise<RazorpayOrderResponse> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) missing');
  }

  const split = calculatePlatformFeeInr(input.amountInr);
  const receipt = `rcpt_${input.purchaseType.slice(0, 1)}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const body = {
    amount: split.totalAmountPaise,
    currency: 'INR',
    receipt,
    notes: {
      filmId: input.filmId,
      filmTitle: input.filmTitle.slice(0, 60),
      filmSlug: input.filmSlug,
      viewerId: input.viewerId,
      viewerEmail: input.viewerEmail,
      purchaseType: input.purchaseType,
      rentDurationHours: (input.rentDurationHours || 48).toString(),
      filmmakerBankOrAccountId: input.filmmakerBankOrAccountId || '',
      platformFeePaise: split.platformFeePaise.toString(),
      filmmakerPayoutPaise: split.filmmakerPayoutPaise.toString(),
      platformFeeInr: split.platformFeeInr.toFixed(2),
      filmmakerPayoutInr: split.filmmakerPayoutInr.toFixed(2),
    },
  };

  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Razorpay order creation failed [${response.status}]: ${errorBody}`);
  }

  return response.json();
}
