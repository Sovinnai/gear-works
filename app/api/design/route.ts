import {saveDb} from '@/lib/save-db';
import {authenticatedSaveKey} from '@/lib/game-identity';
import {newDesignSave,validDesignSave} from '@/lib/process';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){
 const identity=await authenticatedSaveKey(request);if(!identity)return json({error:'Please sign in to open your designs.'},401);
 try{const db=saveDb(),key='process-v1:'+identity;await db.prepare('INSERT INTO game_saves (user_id,state,revision,updated_at) VALUES (?,?,0,?) ON CONFLICT(user_id) DO NOTHING').bind(key,JSON.stringify(newDesignSave()),Date.now()).run();const row=await db.prepare('SELECT state,revision FROM game_saves WHERE user_id=?').bind(key).first<{state:string;revision:number}>();if(!row)throw new Error('Missing design save');const state=JSON.parse(row.state);if(!validDesignSave(state))throw new Error('Invalid design save');return json({state,revision:row.revision});}catch(error){console.error('Design load failed',error);return json({error:'Could not load your designs. Try again.'},503);}
}
export async function PUT(request:Request){
 const identity=await authenticatedSaveKey(request);if(!identity)return json({error:'Please sign in to save your designs.'},401);const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Invalid origin.'},403);
 try{const raw=await request.text();if(raw.length>300000)return json({error:'Design save is too large.'},413);let payload;try{payload=JSON.parse(raw);}catch{return json({error:'Invalid design save.'},400);}if(!validDesignSave(payload?.state)||!Number.isSafeInteger(payload?.revision)||payload.revision<0)return json({error:'Invalid design save.'},400);const result=await saveDb().prepare('UPDATE game_saves SET state=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=?').bind(JSON.stringify(payload.state),Date.now(),'process-v1:'+identity,payload.revision).run();if(result.meta.changes!==1)return json({error:'Your designs changed in another tab. Reload to continue.'},409);return json({revision:payload.revision+1});}catch(error){console.error('Design save failed',error);return json({error:'Save interrupted. Keep this tab open and retry.'},503);}
}
