import { Resend } from 'resend';
import { formatCurrency } from './utils';

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const SENDER = process.env.RESEND_FROM_EMAIL || 'FilmDrop <orders@filmdrop.tv>';

export async function sendPurchaseConfirmationEmail({
  to,
  filmTitle,
  amountCents,
  purchaseType,
  watchUrl,
  expiresAt,
}: {
  to: string;
  filmTitle: string;
  amountCents: number;
  purchaseType: 'buy' | 'rent';
  watchUrl: string;
  expiresAt?: string | null;
}) {
  if (!resend) {
    console.log(`[Resend Mock] Purchase confirmation sent to ${to} for "${filmTitle}" (${purchaseType})`);
    return;
  }

  const isRental = purchaseType === 'rent';
  const price = formatCurrency(amountCents);

  try {
    await resend.emails.send({
      from: SENDER,
      to,
      subject: `Your ticket for "${filmTitle}" on FilmDrop`,
      html: `
        <div style="font-family: sans-serif; background: #08090e; color: #f3f4f6; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: #0f131d; border: 1px solid #1f2738; border-radius: 12px; padding: 32px;">
            <h1 style="color: #f59e0b; margin-top: 0;">🎬 FilmDrop</h1>
            <h2 style="margin-bottom: 8px;">Order Confirmed!</h2>
            <p style="color: #94a3b8; line-height: 1.6;">
              Thank you for supporting independent cinema. You have unlocked access to <strong>${filmTitle}</strong>.
            </p>
            <div style="background: #1b2130; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 4px 0;"><strong>Item:</strong> ${filmTitle}</p>
              <p style="margin: 4px 0;"><strong>Type:</strong> ${isRental ? '48-Hour Rental' : 'Lifetime Ownership'}</p>
              <p style="margin: 4px 0;"><strong>Amount:</strong> ${price}</p>
              ${expiresAt ? `<p style="margin: 4px 0; color: #f59e0b;"><strong>Expires:</strong> ${new Date(expiresAt).toLocaleString()}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${watchUrl}" style="background: #f59e0b; color: #08090e; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;">
                Watch Now
              </a>
            </div>
            <p style="color: #64748b; font-size: 12px; text-align: center;">
              Direct payments empower indie creators. 85% of this purchase goes directly to the filmmaker.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send Resend email:', err);
  }
}

export async function sendFilmmakerPayoutAlert({
  to,
  filmTitle,
  filmmakerAmountCents,
  purchaseType,
}: {
  to: string;
  filmTitle: string;
  filmmakerAmountCents: number;
  purchaseType: 'buy' | 'rent';
}) {
  if (!resend) {
    console.log(`[Resend Mock] Payout alert to ${to}: ${formatCurrency(filmmakerAmountCents)} earned from "${filmTitle}"`);
    return;
  }

  const earned = formatCurrency(filmmakerAmountCents);

  try {
    await resend.emails.send({
      from: SENDER,
      to,
      subject: `💰 You just earned ${earned} on "${filmTitle}"!`,
      html: `
        <div style="font-family: sans-serif; background: #08090e; color: #f3f4f6; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: #0f131d; border: 1px solid #1f2738; border-radius: 12px; padding: 32px;">
            <h1 style="color: #f59e0b; margin-top: 0;">FilmDrop Earnings</h1>
            <h2>New Sale! 🍿</h2>
            <p style="color: #94a3b8; line-height: 1.6;">
              A viewer just ${purchaseType === 'buy' ? 'purchased' : 'rented'} <strong>${filmTitle}</strong>.
            </p>
            <div style="background: #1b2130; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="color: #94a3b8; font-size: 14px;">Your Cut (85%)</span>
              <div style="color: #10b981; font-size: 32px; font-weight: bold; margin-top: 4px;">+${earned}</div>
            </div>
            <p style="color: #94a3b8; font-size: 14px;">
              The funds have been transferred directly to your connected Stripe Express balance.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send filmmaker payout email:', err);
  }
}
