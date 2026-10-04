import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSignedPlaybackToken } from '@/lib/cloudflare';
import { z } from 'zod';

const signedUrlSchema = z.object({
  filmSlug: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const parsed = signedUrlSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid film slug' }, { status: 400 });
    }

    const { filmSlug } = parsed.data;

    // Retrieve film
    const { data: film, error: filmError } = await supabase
      .from('films')
      .select('id, filmmaker_id, cf_video_uid, buy_price_cents, rent_price_cents, status')
      .eq('slug', filmSlug)
      .single();

    let videoUid = film?.cf_video_uid;

    if (!videoUid) {
      // Return sample/mock video ID in local or mock mode
      videoUid = 'sample_video_uid';
    }

    const isFree = film && (film.buy_price_cents === null || film.buy_price_cents === 0) &&
                   (film.rent_price_cents === null || film.rent_price_cents === 0);

    const isFilmmakerOwner = user && film && user.id === film.filmmaker_id;

    if (film && !isFree && !isFilmmakerOwner) {
      if (!user) {
        return NextResponse.json({ error: 'Authentication required for paid content' }, { status: 401 });
      }

      // Check for valid active purchase
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .select('id, expires_at')
        .eq('viewer_id', user.id)
        .eq('film_id', film.id)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (purchaseError || !purchase) {
        return NextResponse.json(
          { error: 'No active purchase or rental found for this film' },
          { status: 403 }
        );
      }
    }

    // Generate signed Cloudflare playback token valid for 2 hours (7200 seconds)
    const token = await generateSignedPlaybackToken(videoUid, 7200);
    const expiresAt = new Date(Date.now() + 7200 * 1000).toISOString();

    const signedUrl = `https://videodelivery.net/${token}/manifest/video.m3u8`;
    const iframeUrl = `https://iframe.videodelivery.net/${token}`;

    return NextResponse.json({
      signedUrl,
      iframeUrl,
      token,
      expiresAt,
    });
  } catch (error: any) {
    console.error('Error generating signed streaming URL:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
