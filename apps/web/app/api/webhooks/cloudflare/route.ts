import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const adminSupabase = createAdminClient();

    const videoUid = payload.uid;
    const status = payload.status?.state;

    if (!videoUid) {
      return NextResponse.json({ error: 'No video UID in webhook payload' }, { status: 400 });
    }

    if (status === 'ready') {
      const durationSeconds = Math.round(payload.duration || 0);
      const thumbnail = payload.thumbnail;

      // Update film status to published if ready
      await adminSupabase
        .from('films')
        .update({
          status: 'published',
          duration_seconds: durationSeconds > 0 ? durationSeconds : undefined,
          thumbnail_url: thumbnail || undefined,
        })
        .eq('cf_video_uid', videoUid);
    } else if (status === 'error') {
      console.error(`Cloudflare Stream encoding error for video ${videoUid}:`, payload.status?.pctComplete);
      await adminSupabase
        .from('films')
        .update({ status: 'draft' })
        .eq('cf_video_uid', videoUid);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Cloudflare webhook error:', error);
    return NextResponse.json({ error: error.message || 'Cloudflare webhook error' }, { status: 500 });
  }
}
