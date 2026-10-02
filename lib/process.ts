import {ITEMS,ITEM_IDS,MACHINES,MACHINE_IDS,RECIPES,type ItemId,type MachineId} from './shop.ts';
export {ITEMS,ITEM_IDS,MACHINES,MACHINE_IDS,RECIPES};
export type {ItemId,MachineId};
export const COLS=8,ROWS=5,STEP=.25;
export type Goal={item:ItemId;qty:number};
export type Challenge={id:string;name:string;client:string;brief:string;focus:string;goals:Goal[];duration:number;capital:number;operating:number;parTime:number;parCost:number;machines:MachineId[];sources:ItemId[];hints:string[]};
const purchased=ITEM_IDS.filter(i=>ITEMS[i].buy>0);
export const CHALLENGES:Challenge[]=[
 {id:'first-cut',name:'First cut',client:'County Machinery',brief:'Deliver twelve unfinished gear sets. Put a hobber between receiving and dispatch, then connect the material route.',focus:'Build a working line',goals:[{item:'rough',qty:12}],duration:140,capital:1100,operating:450,parTime:110,parCost:330,machines:['hobber'],sources:['blank'],hints:['Place a hobber, connect Receiving → Hobber, then Hobber → Dispatch. Select a station and choose Connect output.','The supplier stops after its lot quantity. Twelve blank sets are enough for this order.','Move the hobber closer to the line to shorten transfers. Each link starts with one cart.']},
 {id:'balance',name:'Balance the line',client:'Atlas Process Equipment',brief:'Deliver twenty shaved sets. Cutting, soft finishing, and transport must keep up with one another.',focus:'Capacity and parallel routes',goals:[{item:'shaved',qty:20}],duration:190,capital:3300,operating:950,parTime:145,parCost:650,machines:['hobber','shaver','partner'],sources:['blank'],hints:['A hobber takes 8 seconds; a shaver takes 6. Watch which cell spends its time waiting.','Two hobbing cells can share a source and feed one shaver. Outgoing routes alternate when destinations have space.','An outside shaving operation has a lower equipment cost and a slower cycle. Extra cells or tooling can make up the difference.']},
 {id:'make-or-buy',name:'Make or buy',client:'Dockside Handling',brief:'Build fourteen utility reducers. Bought catalog gears save floor space; making shaved gears lowers material cost.',focus:'Joining two material streams',goals:[{item:'utility',qty:14}],duration:240,capital:5800,operating:2900,parTime:195,parCost:1900,machines:['hobber','shaver','assembly','partner','lathe'],sources:['blank','billet','bought','shaved','kit'],hints:['Every reducer needs a gear set and a housing kit. Connect both suppliers to an assembly bench.','Choose the assembly recipe before connecting gears: catalog gears and shaved gears use different recipes.','Making gears reduces running cost but adds equipment, transfers, and startup time.']},
 {id:'hard-route',name:'Through the hard shop',client:'Meridian Machine Tools',brief:'Deliver twelve ground, case-hardened gear sets. Decide which operations belong inside your shop.',focus:'Heat treatment and bottlenecks',goals:[{item:'ground',qty:12}],duration:330,capital:9200,operating:2200,parTime:245,parCost:850,machines:['hobber','outside','grinder','partner','carburizer'],sources:['blank','rough','hardened'],hints:['The process is hobbing → carburizing → hard grinding. A shaving machine cannot finish hardened gears.','Outside carburizing is much slower than hobbing. Try parallel vendor cells or the express recipe.','Buying hardened sets lets you start at grinding, but consumes more of the operating allowance.']},
 {id:'two-customers',name:'Two customers, one floor',client:'Larch Packaging + Horizon Motion',brief:'Deliver eight industrial reducers and eight precision reducers during the same shift. Separate the soft-finished and hard-ground paths.',focus:'Branches, shared supply, and competing demand',goals:[{item:'industrial',qty:8},{item:'precision',qty:8}],duration:400,capital:15000,operating:3700,parTime:310,parCost:2900,machines:['hobber','shaver','outside','carburizer','grinder','assembly','partner','lathe','mill'],sources:['blank','rough','shaved','hardened','kit','casting','hardware','billet'],hints:['Industrial reducers need shaved-and-carburized gears. Precision reducers need hard-ground gears. Each assembly cell runs one recipe.','Split the rough-gear stream between shaving and carburizing. Destinations with full buffers are skipped.','A shared housing supplier can feed both assembly cells. Increase its lot quantity for both orders.']},
 {id:'mixed-shop',name:'The mixed production shop',client:'North Coast Marine',brief:'Deliver six heavy-duty reducers and ten utility reducers. Supply two nitrided gear sets per heavy reducer while keeping the utility line moving.',focus:'Process choice and material ratios',goals:[{item:'heavy',qty:6},{item:'utility',qty:10}],duration:480,capital:27000,operating:5200,parTime:390,parCost:4400,machines:MACHINE_IDS,sources:purchased,hints:['Heavy reducers need two nitrided sets and one two-stage housing kit. Set the alloy source lot to at least twelve.','Preconditioned 4140 is finish-ground before nitriding. You can buy pre-finished sets or send work to a specialist.','A heavy reducer’s gear input needs buffer space for at least two sets. Input capacities apply separately to each material.']},
];
export const FREEPLAY:Challenge={id:'free-design',name:'Free design',client:'Your production trial',brief:'Build and test any process with the full equipment catalog. Choose a product and target, then compare your runs.',focus:'Unrestricted process design',goals:[{item:'precision',qty:20}],duration:600,capital:100000,operating:50000,parTime:400,parCost:10000,machines:MACHINE_IDS,sources:purchased,hints:['You have the full catalog. Try making housings and blanks from castings and sawn stock.','Buffer racks decouple operations. Machine upgrades shorten cycles; route carts raise transfer capacity.']};
export const MISSIONS=[...CHALLENGES,FREEPLAY];
export type CellKind='source'|'machine'|'buffer'|'sink';
export type Cell={id:number;kind:CellKind;x:number;y:number;machine:MachineId;recipe:string;item:ItemId;capacity:number;level:number;interval:number;lot:number};
export type Link={id:number;from:number;to:number;item:ItemId;carts:number;limit:number};
export type Blueprint={nextId:number;cells:Cell[];links:Link[];goal:ItemId;quantity:number};
export type CellState={input:Partial<Record<ItemId,number>>;output:number;job:{remaining:number}|null;produced:number;received:number;sent:number;busy:number;starved:number;blocked:number;unfunded:number;supplyClock:number;cursor:number};
export type Shipment={id:number;link:number;item:ItemId;remaining:number;duration:number};
export type Run={time:number;spent:number;delivered:Partial<Record<ItemId,number>>;states:Record<number,CellState>;shipments:Shipment[];nextId:number;finished:boolean;success:boolean;history:{time:number;delivered:number}[];routed:Record<number,number>};
export type Result={success:boolean;stars:number;time:number;cost:number;capital:number;delivered:Partial<Record<ItemId,number>>;states:Record<number,CellState>;history:Run['history'];at:number;blueprint:Blueprint};
export type DesignSave={version:1;mission:string;designs:Record<string,Blueprint>;best:Record<string,Result>;last:Record<string,Result>};
export function challengeFor(id:string,b?:Blueprint):Challenge {const c=MISSIONS.find(c=>c.id===id)||CHALLENGES[0];return id===FREEPLAY.id&&b?{...c,goals:[{item:b.goal,qty:b.quantity}]}:c;}
export function cellName(c:Cell) {return c.kind==='source'?ITEMS[c.item].short+' supply':c.kind==='sink'?ITEMS[c.item].short+' dispatch':c.kind==='buffer'?'Buffer rack':MACHINES[c.machine].short;}
export function outputItem(c:Cell):ItemId {return c.kind==='machine'?RECIPES[c.recipe].output:c.item;}
export function accepts(c:Cell,item:ItemId) {return c.kind==='machine'?!!RECIPES[c.recipe].input[item]:(c.kind==='buffer'||c.kind==='sink')&&c.item===item;}
export function makeCell(id:number,kind:CellKind,x:number,y:number,machine:MachineId='hobber',item:ItemId='blank'):Cell {return{id,kind,x,y,machine,recipe:MACHINES[machine].defaultRecipe,item,capacity:3,level:0,interval:4,lot:20};}
export function starter(c:Challenge):Blueprint {
 const source=makeCell(1,'source',0,2,'hobber',c.sources[0]);source.lot=c.goals.reduce((n,g)=>n+g.qty,0);
 const sinks=c.goals.map((g,i)=>makeCell(i+2,'sink',7,c.goals.length===1?2:1+i*2,'hobber',g.item));
 return{nextId:sinks.length+2,cells:[source,...sinks],links:[],goal:c.goals[0].item,quantity:c.goals[0].qty};
}
export function newDesignSave():DesignSave{return{version:1,mission:CHALLENGES[0].id,designs:{[CHALLENGES[0].id]:starter(CHALLENGES[0])},best:{},last:{}};}
export function cellCost(c:Cell) {if(c.kind==='source'||c.kind==='sink')return 0;if(c.kind==='buffer')return 120+(c.capacity-3)*20;const base=MACHINES[c.machine].cost;return base+Math.round(base*.4*c.level)+(c.capacity-3)*20;}
export function capitalCost(b:Blueprint) {return b.cells.reduce((n,c)=>n+cellCost(c),0)+b.links.reduce((n,l)=>n+35+(l.carts-1)*100,0);}
export function cycle(c:Cell) {return RECIPES[c.recipe].seconds/(1+c.level*.3);}
export function travelTime(b:Blueprint,l:Link) {const a=b.cells.find(c=>c.id===l.from)!,z=b.cells.find(c=>c.id===l.to)!;return 1+Math.abs(a.x-z.x)+Math.abs(a.y-z.y);}
export function recipesFor(c:Challenge,m:MachineId) {return Object.entries(RECIPES).filter(([,r])=>r.machine===m&&c.machines.includes(m));}
export function connect(b:Blueprint,from:number,to:number):{blueprint:Blueprint;error?:string} {
 const a=b.cells.find(c=>c.id===from),z=b.cells.find(c=>c.id===to);
 if(!a||!z||a.id===z.id||a.kind==='sink'||!accepts(z,outputItem(a)))return{blueprint:b,error:'The destination does not use this output. Check its recipe or material.'};
 if(b.links.some(l=>l.from===from&&l.to===to))return{blueprint:b,error:'These cells are already connected.'};
 const next=structuredClone(b);next.links.push({id:next.nextId++,from,to,item:outputItem(a),carts:1,limit:0});return{blueprint:next};
}
export function validateBlueprint(b:unknown):b is Blueprint {
 if(!b||typeof b!=='object')return false;const v=b as Blueprint;const int=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isInteger(n)&&n>=min&&n<=max;
 if(!int(v.nextId,1,100000)||!ITEM_IDS.includes(v.goal)||!int(v.quantity,1,100)||!Array.isArray(v.cells)||v.cells.length>40||!Array.isArray(v.links)||v.links.length>160)return false;
 if(!v.cells.every(c=>c&&int(c.id,1,v.nextId-1)&&['source','machine','buffer','sink'].includes(c.kind)&&int(c.x,0,COLS-1)&&int(c.y,0,ROWS-1)&&MACHINE_IDS.includes(c.machine)&&Object.hasOwn(RECIPES,c.recipe)&&RECIPES[c.recipe].machine===c.machine&&ITEM_IDS.includes(c.item)&&int(c.capacity,3,12)&&int(c.level,0,2)&&[2,4,8].includes(c.interval)&&int(c.lot,1,100)))return false;
 if(new Set(v.cells.map(c=>c.id)).size!==v.cells.length||new Set(v.cells.map(c=>c.x+','+c.y)).size!==v.cells.length)return false;
 if(!v.links.every(l=>l&&int(l.id,1,v.nextId-1)&&int(l.carts,1,3)&&int(l.limit,0,100)&&ITEM_IDS.includes(l.item)&&l.from!==l.to&&v.cells.some(c=>c.id===l.from&&c.kind!=='sink'&&outputItem(c)===l.item)&&v.cells.some(c=>c.id===l.to&&accepts(c,l.item))))return false;
 return new Set([...v.cells.map(c=>c.id),...v.links.map(l=>l.id)]).size===v.cells.length+v.links.length&&new Set(v.links.map(l=>l.from+':'+l.to)).size===v.links.length;
}
export function designIssues(b:Blueprint,c:Challenge):{blocking:string[];notes:string[]} {
 const blocking:string[]=[],notes:string[]=[];
 if(capitalCost(b)>c.capital)blocking.push(`Equipment and routes exceed the capital allowance by $${capitalCost(b)-c.capital}.`);
 if(b.cells.some(n=>n.kind==='machine'&&!c.machines.includes(n.machine)))blocking.push('This contract does not allow one of your machines.');
 if(b.cells.some(n=>n.kind==='source'&&!c.sources.includes(n.item)))blocking.push('This contract does not allow one of your purchased materials.');
 if(!b.cells.some(n=>n.kind==='source'))blocking.push('Add a supplier for your starting material.');
 for(const g of c.goals)if(!b.cells.some(n=>n.kind==='sink'&&n.item===g.item))blocking.push(`Add a dispatch cell for ${ITEMS[g.item].short.toLowerCase()}.`);
 for(const n of b.cells){
  if(n.kind==='machine')for(const i of Object.keys(RECIPES[n.recipe].input) as ItemId[])if(!b.links.some(l=>l.to===n.id&&l.item===i))notes.push(`${cellName(n)} #${n.id} has no incoming ${ITEMS[i].short.toLowerCase()} route.`);
  if(n.kind!=='sink'&&!b.links.some(l=>l.from===n.id))notes.push(`${cellName(n)} #${n.id} has no outgoing route.`);
 }
 const reachable=new Set(b.cells.filter(n=>n.kind==='source').map(n=>n.id));let changed=true;while(changed){changed=false;for(const l of b.links)if(reachable.has(l.from)&&!reachable.has(l.to)){reachable.add(l.to);changed=true;}}
 for(const n of b.cells.filter(n=>n.kind==='sink'))if(!reachable.has(n.id))notes.push(`${ITEMS[n.item].short} dispatch is disconnected from all suppliers.`);
 return{blocking,notes};
}
function initialState():CellState{return{input:{},output:0,job:null,produced:0,received:0,sent:0,busy:0,starved:0,blocked:0,unfunded:0,supplyClock:0,cursor:0};}
export function newRun(b:Blueprint):Run {return{time:0,spent:0,delivered:{},states:Object.fromEntries(b.cells.map(c=>[c.id,initialState()])),shipments:[],nextId:1,finished:false,success:false,history:[{time:0,delivered:0}],routed:{}};}
export function incomingCount(run:Run,b:Blueprint,id:number,item:ItemId) {const ids=new Set(b.links.filter(l=>l.to===id&&l.item===item).map(l=>l.id));return run.shipments.filter(s=>ids.has(s.link)).length;}
export function inputCount(s:CellState) {return Object.values(s.input).reduce((n,v)=>n+(v||0),0);}
export function stateLabel(c:Cell,s:CellState):string {
 if(c.kind==='sink')return `${s.received} delivered`;
 if(c.kind==='source')return s.produced>=c.lot?'Lot supplied':s.output>=c.capacity?'Rack full':s.unfunded>0&&s.produced===0?'No operating funds':'Supplying';
 if(c.kind==='buffer')return `${s.output} buffered`;
 if(s.job)return s.job.remaining<=0?'Output blocked':'Working';
 if(s.output>=c.capacity)return 'Output blocked';
 if(Object.entries(RECIPES[c.recipe].input).some(([i,n])=>(s.input[i as ItemId]||0)<n!))return 'Input starved';
 return 'Waiting for funds';
}
export function stepRun(previous:Run,b:Blueprint,c:Challenge,steps=1):Run {
 const r=structuredClone(previous);
 for(let step=0;step<steps&&!r.finished;step++){
  const dt=Math.min(STEP,c.duration-r.time);if(dt<=0){r.finished=true;break;}
  for(const cell of b.cells){if(cell.kind!=='machine')continue;const s=r.states[cell.id],recipe=RECIPES[cell.recipe];if(s.job&&s.job.remaining>0)s.busy+=dt;else if(s.job||s.output>=cell.capacity)s.blocked+=dt;else if(Object.entries(recipe.input).some(([i,n])=>(s.input[i as ItemId]||0)<n!))s.starved+=dt;else if(r.spent+recipe.fee>c.operating)s.unfunded+=dt;else s.busy+=dt;}
  r.time=Number((r.time+dt).toFixed(6));
  const arrived:Shipment[]=[];for(const s of r.shipments){s.remaining-=dt;if(s.remaining<=0)arrived.push(s);}r.shipments=r.shipments.filter(s=>s.remaining>0);
  for(const ship of arrived){const link=b.links.find(l=>l.id===ship.link)!,dest=b.cells.find(n=>n.id===link.to)!,state=r.states[dest.id];state.received++;if(dest.kind==='sink')r.delivered[ship.item]=(r.delivered[ship.item]||0)+1;else if(dest.kind==='buffer')state.output++;else state.input[ship.item]=(state.input[ship.item]||0)+1;}
  for(const cell of b.cells){const s=r.states[cell.id];
   if(cell.kind==='machine'&&s.job){if(s.job.remaining>0){s.job.remaining-=dt;}if(s.job.remaining<=0){if(s.output<cell.capacity){s.output++;s.produced++;s.job=null;}}}
   if(cell.kind==='source'){s.supplyClock=Math.max(0,s.supplyClock-dt);if(s.produced<cell.lot&&s.supplyClock===0&&s.output<cell.capacity){if(r.spent+ITEMS[cell.item].buy<=c.operating){r.spent+=ITEMS[cell.item].buy;s.output++;s.produced++;s.supplyClock=cell.interval;}else s.unfunded+=dt;}}
  }
  // Outgoing edges take turns. Destination space includes reservations in transit.
  for(const cell of b.cells){if(cell.kind==='sink')continue;const s=r.states[cell.id],links=b.links.filter(l=>l.from===cell.id);if(!links.length)continue;const start=s.cursor;
   for(let i=0;i<links.length&&s.output>0;i++){const index=(start+i)%links.length,l=links[index],dest=b.cells.find(n=>n.id===l.to)!,ds=r.states[dest.id];const occupied=dest.kind==='buffer'?ds.output:(ds.input[l.item]||0);const space=dest.kind==='sink'?Infinity:dest.capacity-occupied-incomingCount(r,b,dest.id,l.item);const busy=r.shipments.filter(m=>m.link===l.id).length;
    if(space>0&&busy<l.carts&&(!l.limit||(r.routed[l.id]||0)<l.limit)){s.output--;s.sent++;r.routed[l.id]=(r.routed[l.id]||0)+1;r.shipments.push({id:r.nextId++,link:l.id,item:l.item,remaining:travelTime(b,l),duration:travelTime(b,l)});s.cursor=(index+1)%links.length;}
   }
  }
  for(const cell of b.cells){if(cell.kind!=='machine')continue;const s=r.states[cell.id];if(s.job)continue;
   const recipe=RECIPES[cell.recipe];if(s.output>=cell.capacity){continue;}
   if(!Object.entries(recipe.input).every(([item,n])=>(s.input[item as ItemId]||0)>=n!)){continue;}
   if(r.spent+recipe.fee>c.operating){continue;}
   for(const [item,n]of Object.entries(recipe.input))s.input[item as ItemId]!-=n!;
   r.spent+=recipe.fee;s.job={remaining:cycle(cell)};
  }
  r.success=c.goals.every(g=>(r.delivered[g.item]||0)>=g.qty);
  if(r.success||r.time>=c.duration)r.finished=true;
  if(Math.floor(r.time/5)>Math.floor((r.time-dt)/5)||r.finished)r.history.push({time:r.time,delivered:Object.values(r.delivered).reduce((n,v)=>n+(v||0),0)});
 }
 return r;
}
export function finishRun(r:Run,b:Blueprint,c:Challenge):Run{return stepRun(r,b,c,Math.ceil((c.duration-r.time)/STEP)+1);}
export function resultOf(r:Run,b:Blueprint,c:Challenge):Result {return{success:r.success,stars:r.success?1+(r.time<=c.parTime?1:0)+(r.spent<=c.parCost?1:0):0,time:r.time,cost:r.spent,capital:capitalCost(b),delivered:r.delivered,states:r.states,history:r.history,at:Date.now(),blueprint:structuredClone(b)};}
export function recordResult(save:DesignSave,id:string,result:Result):DesignSave {const s=structuredClone(save);s.last[id]=result;const best=s.best[id];if(result.success&&(!best||result.stars>best.stars||result.stars===best.stars&&(result.time<best.time||result.time===best.time&&result.cost<best.cost)))s.best[id]=result;return s;}
export function unlocked(save:DesignSave,index:number) {return index===0||index>=CHALLENGES.length||!!save.best[CHALLENGES[index-1].id]?.success;}
export function validDesignSave(v:unknown):v is DesignSave {
 if(!v||typeof v!=='object')return false;const s=v as DesignSave,ids=MISSIONS.map(c=>c.id);const num=(x:unknown)=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=1e15;
 if(s.version!==1||!ids.includes(s.mission)||!s.designs||!s.best||!s.last)return false;
 if(!Object.entries(s.designs).every(([id,b])=>ids.includes(id)&&validateBlueprint(b))||!s.designs[s.mission])return false;
 const result=(r:Result)=>r&&validateBlueprint(r.blueprint)&&typeof r.success==='boolean'&&Number.isInteger(r.stars)&&r.stars>=0&&r.stars<=3&&num(r.time)&&num(r.cost)&&num(r.capital)&&num(r.at)&&r.delivered&&Object.entries(r.delivered).every(([i,n])=>ITEM_IDS.includes(i as ItemId)&&num(n))&&r.states&&Object.values(r.states).every(st=>st&&['produced','received','sent','busy','starved','blocked','unfunded','output','supplyClock','cursor'].every(k=>num(st[k as keyof CellState]))&&st.input&&Object.entries(st.input).every(([i,n])=>ITEM_IDS.includes(i as ItemId)&&num(n))&&(st.job===null||st.job&&typeof st.job.remaining==='number'&&Number.isFinite(st.job.remaining)))&&Array.isArray(r.history)&&r.history.length<=500&&r.history.every(p=>num(p.time)&&num(p.delivered));
 return Object.entries(s.best).every(([id,r])=>ids.includes(id)&&result(r))&&Object.entries(s.last).every(([id,r])=>ids.includes(id)&&result(r));
}
