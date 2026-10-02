import { saveDb } from '@/lib/save-db';
import { fresh, validGame } from '@/lib/game';
import { authenticatedSaveKey } from '@/lib/game-identity';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function GET(request: Request) {
  const user = await authenticatedSaveKey(request);
  if (!user) return json({ error: 'Please sign in to load your factory.' }, 401);
  try {
    const db = saveDb();
    await db.prepare('INSERT INTO game_saves (user_id, state, revision, updated_at) VALUES (?, ?, 0, ?) ON CONFLICT(user_id) DO NOTHING').bind(user, JSON.stringify(fresh()), Date.now()).run();
    const row = await db.prepare('SELECT state, revision FROM game_saves WHERE user_id = ?').bind(user).first<{ state: string; revision: number }>();
    if (!row) throw new Error('Missing save');
    const state = JSON.parse(row.state);
    if (!validGame(state)) throw new Error('Invalid save');
    return json({ state, revision: row.revision });
  } catch (error) { console.error('Load failed', error); return json({ error: 'Your factory could not be loaded. Try again.' }, 503); }
}
export async function PUT(request: Request) {
  const user = await authenticatedSaveKey(request);
  if (!user) return json({ error: 'Please sign in to save your factory.' }, 401);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  try {
    const raw = await request.text();
    if (raw.length > 12000) return json({ error: 'Save too large.' }, 413);
    let payload;
    try { payload = JSON.parse(raw); } catch { return json({ error: 'Invalid save.' }, 400); }
    if (!validGame(payload?.state) || !Number.isSafeInteger(payload?.revision) || payload.revision < 0) return json({ error: 'Invalid save.' }, 400);
    const result = await saveDb().prepare('UPDATE game_saves SET state = ?, revision = revision + 1, updated_at = ? WHERE user_id = ? AND revision = ?').bind(JSON.stringify(payload.state), Date.now(), user, payload.revision).run();
    if (result.meta.changes !== 1) return json({ error: 'This factory was updated in another tab. Reload to continue.' }, 409);
    return json({ revision: payload.revision + 1 });
  } catch (error) { console.error('Save failed', error); return json({ error: 'Save interrupted. Keep this tab open and retry.' }, 503); }
}
