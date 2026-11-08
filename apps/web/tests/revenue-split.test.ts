import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePlatformFeeInr } from '../lib/razorpay.ts';
import { calculatePlatformFee } from '../lib/stripe.ts';

describe('Revenue Split Engine — Zero Leakage Guarantee', () => {
  describe('India INR (Razorpay 85/15)', () => {
    const inrCases = [
      { amount: 49, label: '₹49 micro-short film' },
      { amount: 79, label: '₹79 regional cinema rental' },
      { amount: 99, label: '₹99 standard 48h rental' },
      { amount: 149, label: '₹149 special festival premiere' },
      { amount: 199, label: '₹199 standard feature buy' },
      { amount: 249, label: '₹249 mid-tier buy' },
      { amount: 299, label: '₹299 lifetime 4K pass' },
      { amount: 499, label: '₹499 director cut edition' },
      { amount: 999, label: '₹999 festival season bundle' },
      { amount: 19.95, label: '₹19.95 fractional test' },
    ];

    for (const { amount, label } of inrCases) {
      it(`guarantees exact zero-paisa leakage for ${label} (₹${amount})`, () => {
        const split = calculatePlatformFeeInr(amount);

        // 1. Integer paise conservation
        assert.equal(
          split.platformFeePaise + split.filmmakerPayoutPaise,
          split.totalAmountPaise,
          `Paise sum must equal total: ${split.platformFeePaise} + ${split.filmmakerPayoutPaise} !== ${split.totalAmountPaise}`
        );

        // 2. Rupee representation conservation
        const sumInr = Number((split.platformFeeInr + split.filmmakerPayoutInr).toFixed(2));
        assert.equal(
          sumInr,
          split.totalAmountInr,
          `Rupee sum must equal total: ${sumInr} !== ${split.totalAmountInr}`
        );

        // 3. 15% platform cut precision
        const expectedFeePaise = Math.round(split.totalAmountPaise * 0.15);
        assert.equal(split.platformFeePaise, expectedFeePaise);

        // 4. Filmmaker receives at least 84.5% to 85.5% (effective 85%)
        assert.ok(split.filmmakerPayoutPaise > 0);
        assert.ok(split.filmmakerPayoutPaise >= split.platformFeePaise * 5);
      });
    }

    it('rejects zero or negative amounts with descriptive errors', () => {
      assert.throws(() => calculatePlatformFeeInr(0), /Amount must be greater than zero/);
      assert.throws(() => calculatePlatformFeeInr(-99), /Amount must be greater than zero/);
    });
  });

  describe('USD Global (Stripe 85/15)', () => {
    const usdCases = [2.99, 4.99, 9.99, 12.99, 14.99, 19.99, 49.99];

    for (const amount of usdCases) {
      it(`guarantees zero-cent leakage for $${amount}`, () => {
        const totalCents = Math.round(amount * 100);
        const { platformFeeCents, filmmakerAmountCents } = calculatePlatformFee(totalCents);

        // Cent conservation
        assert.equal(
          platformFeeCents + filmmakerAmountCents,
          totalCents,
          `Cent sum must equal total: ${platformFeeCents} + ${filmmakerAmountCents} !== ${totalCents}`
        );

        // 15% platform tier
        const expectedFeeCents = Math.round(totalCents * 0.15);
        assert.equal(platformFeeCents, expectedFeeCents);
      });
    }
  });
});
