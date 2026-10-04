import { neon, neonConfig, Pool } from '@neondatabase/serverless';

// Configure WebSocket constructor for serverless edge / node environments if needed
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL || '';

export const sql = connectionString ? neon(connectionString) : null;

export const pool = connectionString ? new Pool({ connectionString }) : null;

export async function queryNeon<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  if (!sql) {
    console.warn('[Neon DB] DATABASE_URL is not set. Operating in local / fallback mode.');
    return [];
  }
  try {
    const result = await (sql as any)(queryString, params);
    return result as T[];
  } catch (error) {
    console.error('[Neon DB Error]:', error);
    throw error;
  }
}

// Typed Neon query helpers
export async function getPublishedFilmsFromNeon() {
  return queryNeon(`
    SELECT 
      f.*,
      p.display_name as filmmaker_name,
      p.avatar_url as filmmaker_avatar
    FROM films f
    JOIN profiles p ON f.filmmaker_id = p.id
    WHERE f.status = 'published'
    ORDER BY f.created_at DESC
  `);
}

export async function getFilmBySlugFromNeon(slug: string) {
  const rows = await queryNeon(`
    SELECT 
      f.*,
      p.display_name as filmmaker_name,
      p.avatar_url as filmmaker_avatar,
      p.bio as filmmaker_bio
    FROM films f
    JOIN profiles p ON f.filmmaker_id = p.id
    WHERE f.slug = $1
    LIMIT 1
  `, [slug]);
  return rows[0] || null;
}
