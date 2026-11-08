import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { verifyRazorpaySignature, verifyRazorpayWebhookSignature } from '../lib/razorpay.ts';

describe('Razorpay Cryptographic Verification Suite', () => {
  const secret = 'rzp_test_secret_987654321';
  const orderId = 'order_M1k8A9B2C3D4E5';
  const paymentId = 'pay_P9Q8R7S6T5U4V3';

  function createValidSignature(payload: string, key: string): string {
    return crypto.createHmac('sha256', key).update(payload).digest('hex');
  }

  it('validates a genuine checkout payment signature', () => {
    const validSignature = createValidSignature(`${orderId}|${paymentId}`, secret);
    const isValid = verifyRazorpaySignature({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: validSignature,
      secret,
    });
    assert.equal(isValid, true, 'Genuine signature should be verified as true');
  });

  it('rejects tampered orderId in checkout verification', () => {
    const validSignature = createValidSignature(`${orderId}|${paymentId}`, secret);
    const isValid = verifyRazorpaySignature({
      razorpayOrderId: 'order_TAMPERED_000',
      razorpayPaymentId: paymentId,
      razorpaySignature: validSignature,
      secret,
    });
    assert.equal(isValid, false, 'Tampered orderId must fail verification');
  });

  it('rejects tampered paymentId in checkout verification', () => {
    const validSignature = createValidSignature(`${orderId}|${paymentId}`, secret);
    const isValid = verifyRazorpaySignature({
      razorpayOrderId: orderId,
      razorpayPaymentId: 'pay_TAMPERED_999',
      razorpaySignature: validSignature,
      secret,
    });
    assert.equal(isValid, false, 'Tampered paymentId must fail verification');
  });

  it('rejects mismatched signature hashes', () => {
    const isValid = verifyRazorpaySignature({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: 'deadbeef00112233445566778899aabbccddeeff',
      secret,
    });
    assert.equal(isValid, false, 'Arbitrary hash must fail verification');
  });

  it('verifies genuine webhook HMAC signatures against raw payload', () => {
    const webhookSecret = 'whsec_rzp_live_secret_4455';
    const rawPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: { entity: { id: paymentId, amount: 29900 } },
        order: { entity: { id: orderId, amount: 29900 } },
      },
    });

    const validWebhookSig = createValidSignature(rawPayload, webhookSecret);
    const isValid = verifyRazorpayWebhookSignature({
      rawPayload,
      signature: validWebhookSig,
      webhookSecret,
    });
    assert.equal(isValid, true, 'Valid webhook payload signature must pass');
  });

  it('rejects tampered webhook payloads', () => {
    const webhookSecret = 'whsec_rzp_live_secret_4455';
    const rawPayload = JSON.stringify({ event: 'payment.captured' });
    const tamperedPayload = JSON.stringify({ event: 'order.paid' });

    const signature = createValidSignature(rawPayload, webhookSecret);
    const isValid = verifyRazorpayWebhookSignature({
      rawPayload: tamperedPayload,
      signature,
      webhookSecret,
    });
    assert.equal(isValid, false, 'Tampered payload must fail webhook verification');
  });
});
