import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initiateCloudflareDirectUpload } from '@/lib/cloudflare';
import { z } from 'zod';

const uploadRequestSchema = z.object({
  filmId: z.string().uuid(),
  fileName: z.string().min(1),
  fileSizeBytes: z.number().positive().max(50 * 1024 * 1024 * 1024), // Max 50GB
  isTrailer: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    const body = await req.json();
    const parsed = uploadRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { filmId, fileName, isTrailer } = parsed.data;
    const creatorId = user ? user.id : 'demo_filmmaker_id';

    // In dev / preview without Supabase connected, or when user is authenticated
    if (user) {
      const { data: film, error: filmError } = await supabase
        .from('films')
        .select('id, filmmaker_id')
        .eq('id', filmId)
        .single();

      if (!filmError && film && film.filmmaker_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden: You do not own this film' }, { status: 403 });
      }
    }

    // Get direct TUS upload URL from Cloudflare Stream
    const { uploadUrl, uid: videoUid } = await initiateCloudflareDirectUpload({
      fileName,
      creatorId,
    });

    if (user) {
      const updatePayload = isTrailer
        ? { cf_trailer_uid: videoUid }
        : { cf_video_uid: videoUid, status: 'processing' };

      await supabase
        .from('films')
        .update(updatePayload)
        .eq('id', filmId);
    }

    return NextResponse.json({ uploadUrl, videoUid });
  } catch (error: any) {
    console.error('Upload initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
