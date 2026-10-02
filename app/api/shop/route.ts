import { saveDb } from '@/lib/save-db';
import { newShop, validShop, upgradeShop } from '@/lib/shop';
import { authenticatedSaveKey } from '@/lib/game-identity';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function GET(request: Request) {
  const identity = await authenticatedSaveKey(request);
  const user = identity ? 'shop-v2:' + identity : null;
  if (!user) return json({ error: 'Please sign in to load your machine shop.' }, 401);
  try {
    const db = saveDb();
    await db.prepare('INSERT INTO game_saves (user_id, state, revision, updated_at) VALUES (?, ?, 0, ?) ON CONFLICT(user_id) DO NOTHING').bind(user, JSON.stringify(newShop()), Date.now()).run();
    const row = await db.prepare('SELECT state, revision FROM game_saves WHERE user_id = ?').bind(user).first<{ state: string; revision: number }>();
    if (!row) throw new Error('Missing save');
    const state = upgradeShop(JSON.parse(row.state));
    if (!state) throw new Error('Invalid save');
    return json({ state, revision: row.revision });
  } catch (error) { console.error('Load failed', error); return json({ error: 'Your machine shop could not be loaded. Try again.' }, 503); }
}
export async function PUT(request: Request) {
  const identity = await authenticatedSaveKey(request);
  const user = identity ? 'shop-v2:' + identity : null;
  if (!user) return json({ error: 'Please sign in to save your machine shop.' }, 401);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  try {
    const raw = await request.text();
    if (raw.length > 180000) return json({ error: 'Save too large.' }, 413);
    let payload;
    try { payload = JSON.parse(raw); } catch { return json({ error: 'Invalid save.' }, 400); }
    if (payload?.state?.version === 2) return json({ error: 'The machine shop has new equipment and routes. Reload to keep playing with your saved progress.' }, 409);
    if (!validShop(payload?.state) || !Number.isSafeInteger(payload?.revision) || payload.revision < 0) return json({ error: 'Invalid save.' }, 400);
    const result = await saveDb().prepare('UPDATE game_saves SET state = ?, revision = revision + 1, updated_at = ? WHERE user_id = ? AND revision = ?').bind(JSON.stringify(payload.state), Date.now(), user, payload.revision).run();
    if (result.meta.changes !== 1) return json({ error: 'This machine shop was updated in another tab. Reload to continue.' }, 409);
    return json({ revision: payload.revision + 1 });
  } catch (error) { console.error('Save failed', error); return json({ error: 'Save interrupted. Keep this tab open and retry.' }, 503); }
}
