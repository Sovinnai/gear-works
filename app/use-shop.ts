'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {toast} from 'sonner';
import {advanceShop,newShop,shopAction,validShop,type Shop,type ShopAction} from '@/lib/shop';
export function useShop(){
 const [game,setGame]=useState<Shop>(()=>newShop());const ref=useRef(game);
 const [loaded,setLoaded]=useState(false),[loadError,setLoadError]=useState(''),[saveError,setSaveError]=useState(''),[status,setStatus]=useState('Loading'),[conflict,setConflict]=useState(false);
 const [away,setAway]=useState<{cash:number;sets:number;minutes:number}|null>(null);
 const ready=useRef(false),blocked=useRef(false),revision=useRef(0),busy=useRef(false),pending=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const commit=useCallback((g:Shop)=>{ref.current=g;setGame(g);},[]);
 const save=useCallback(async function save(keepalive=false){
  if(!ready.current||blocked.current)return;if(busy.current){pending.current=true;return;}busy.current=true;setStatus('Saving');const state=advanceShop(ref.current);commit(state);
  try{const r=await fetch('/api/shop',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({state,revision:revision.current}),keepalive});const data=await r.json() as {error?:string;revision:number};if(r.status===409){blocked.current=true;setConflict(true);}if(!r.ok)throw new Error(data.error||'Save interrupted. Retry with this tab open.');revision.current=data.revision;setStatus('Saved');setSaveError('');}
  catch(e){setStatus('Not saved');setSaveError(e instanceof Error?e.message:'Save interrupted.');}
  finally{busy.current=false;if(pending.current&&!blocked.current){pending.current=false;void save();}}
 },[commit]);
 const load=useCallback(async()=>{
  setLoadError('');try{const r=await fetch('/api/shop',{cache:'no-store'});const d=await r.json() as {state:unknown;revision:number;error?:string};if(!r.ok)throw new Error(d.error||'Could not load the shop.');if(!validShop(d.state))throw new Error('Could not read your shop save.');const before=d.state;const after=advanceShop(before);const minutes=Math.min(480,Math.floor((Date.now()-before.last)/60000));if(minutes>=1)setAway({cash:after.revenue-before.revenue,sets:Object.values(after.made).reduce((n,q)=>n+q,0)-Object.values(before.made).reduce((n,q)=>n+q,0),minutes});revision.current=d.revision;ready.current=true;blocked.current=false;commit(after);setLoaded(true);setConflict(false);setStatus('Saved');void save();}catch(e){setLoadError(e instanceof Error?e.message:'Could not load the shop.');}
 },[commit,save]);
 useEffect(()=>{void load();const clock=setInterval(()=>{if(ready.current&&!blocked.current&&!document.hidden)commit(advanceShop(ref.current));},120);const autosave=setInterval(()=>void save(),15000);const visibility=()=>{if(document.hidden)void save(true);else if(ready.current&&!blocked.current)commit(advanceShop(ref.current));};const closing=()=>void save(true);document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',closing);return()=>{clearInterval(clock);clearInterval(autosave);if(timer.current)clearTimeout(timer.current);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',closing);};},[load,commit,save]);
 const act=useCallback((action:ShopAction)=>{if(!ready.current||blocked.current)return {ok:false,message:'Load the shop first.'};const result=shopAction(ref.current,action);commit(result.state);if(result.message)(result.ok?toast.success:toast.error)(result.message);if(result.ok){if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>void save(),450);}return {ok:result.ok,message:result.message,cash:result.state.cash};},[commit,save]);
 return {game,ref,loaded,loadError,saveError,status,conflict,away,setAway,act,load,save};
}
