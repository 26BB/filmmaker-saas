import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const progressSchema = z.object({
  filmId: z.string().uuid(),
  watchDurationSeconds: z.number().nonnegative(),
  completed: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const parsed = progressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid watch progress payload' }, { status: 400 });
    }

    const { filmId, watchDurationSeconds, completed } = parsed.data;

    // Record or update watch session
    if (user) {
      await supabase.from('watch_sessions').insert({
        viewer_id: user.id,
        film_id: filmId,
        watch_duration_seconds: watchDurationSeconds,
        completed: completed || false,
      });
    }

    // Increment total views if session just started (e.g. at 5 seconds)
    if (watchDurationSeconds >= 5 && watchDurationSeconds <= 10) {
      const { data: film } = await supabase
        .from('films')
        .select('total_views')
        .eq('id', filmId)
        .single();

      if (film) {
        await supabase
          .from('films')
          .update({ total_views: (film.total_views || 0) + 1 })
          .eq('id', filmId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Watch progress error:', error);
    return NextResponse.json({ error: 'Failed to record watch session' }, { status: 500 });
  }
}
