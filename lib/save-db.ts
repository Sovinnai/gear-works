import { env } from 'cloudflare:workers';
export function saveDb(): D1Database {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error('Save database unavailable');
  return db;
}
