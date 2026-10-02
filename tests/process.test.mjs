import assert from 'node:assert/strict';
import {CHALLENGES,FREEPLAY,makeCell,connect,newRun,finishRun,stepRun,validateBlueprint,designIssues,capitalCost,resultOf,recordResult,newDesignSave,validDesignSave,ITEMS,RECIPES,travelTime} from '../lib/process.ts';
function builder(c){const b={nextId:1,cells:[],links:[],goal:c.goals[0].item,quantity:c.goals[0].qty};return{b,
 source(item,lot,x,y){const n=makeCell(b.nextId++,'source',x,y,'hobber',item);n.lot=lot;b.cells.push(n);return n.id;},
 machine(recipe,x,y){const n=makeCell(b.nextId++,'machine',x,y,RECIPES[recipe].machine);n.recipe=recipe;b.cells.push(n);return n.id;},
 sink(item,x,y){const n=makeCell(b.nextId++,'sink',x,y,'hobber',item);b.cells.push(n);return n.id;},
 link(from,to,carts=1){const n=connect(b,from,to);assert.equal(n.error,undefined);b.links=n.blueprint.links;b.nextId=n.blueprint.nextId;b.links.at(-1).carts=carts;return b.links.at(-1);}};}
const blueprints=[];
{
 const p=builder(CHALLENGES[0]);const a=p.source('blank',12,0,2),m=p.machine('hob',3,2),z=p.sink('rough',7,2);p.link(a,m);p.link(m,z);blueprints.push(p.b);
}
{
 const p=builder(CHALLENGES[1]);const a=p.source('blank',20,0,2),m=p.machine('hob',2,1),m2=p.machine('hob',2,3),s=p.machine('shave',4,2),z=p.sink('shaved',6,2);p.link(a,m);p.link(a,m2);p.link(m,s);p.link(m2,s);p.link(s,z);blueprints.push(p.b);
}
{
 const p=builder(CHALLENGES[2]);const a=p.source('blank',14,0,1),h=p.machine('hob',1,1),s=p.machine('shave',2,1),k=p.source('kit',14,3,3),m=p.machine('utilityMake',3,1),z=p.sink('utility',5,1);p.link(a,h);p.link(h,s);p.link(s,m);p.link(k,m);p.link(m,z);blueprints.push(p.b);
}
{
 const p=builder(CHALLENGES[3]);const a=p.source('blank',12,0,2),h=p.machine('hob',1,2),f=p.machine('outsource',2,1),f2=p.machine('outsource',2,3),g=p.machine('grind',3,2),z=p.sink('ground',5,2);p.link(a,h);p.link(h,f);p.link(h,f2);p.link(f,g);p.link(f2,g);p.link(g,z);blueprints.push(p.b);
}
{
 const p=builder(CHALLENGES[4]);const a=p.source('blank',16,0,2),h=p.machine('hob',1,2),s=p.machine('shave',2,1),f=p.machine('outsourceShaved',3,1),f2=p.machine('rushCarburize',2,3),g=p.machine('subGrind',3,3),k=p.source('kit',16,4,2),assembly=p.machine('industrial',5,1),asm2=p.machine('precision',5,3),z=p.sink('industrial',7,1),z2=p.sink('precision',7,3);p.link(a,h);p.link(h,s).limit=8;p.link(h,f2).limit=8;p.link(s,f);p.link(f,assembly);p.link(f2,g);p.link(g,asm2);p.link(k,assembly).limit=8;p.link(k,asm2).limit=8;p.link(assembly,z);p.link(asm2,z2);blueprints.push(p.b);
}
{
 const p=builder(CHALLENGES[5]);const a=p.source('alloy',12,0,1),h=p.machine('hobAlloy',1,1),g=p.machine('grindAlloy',2,1),n=p.machine('subNitride',3,0),n2=p.machine('subNitride',3,2),k=p.source('heavyKit',6,4,0),asm=p.machine('heavy',4,1),z=p.sink('heavy',6,1),buy=p.source('bought',10,1,4),kit=p.source('kit',10,3,4),utility=p.machine('utilityBuy',4,4),uz=p.sink('utility',6,4);p.link(a,h);p.link(h,g);p.link(g,n);p.link(g,n2);p.link(n,asm);p.link(n2,asm);p.link(k,asm);p.link(asm,z);p.link(buy,utility);p.link(kit,utility);p.link(utility,uz);blueprints.push(p.b);
}
for(let i=0;i<blueprints.length;i++){
 const c=CHALLENGES[i],b=blueprints[i];assert.ok(validateBlueprint(b));assert.deepEqual(designIssues(b,c).blocking,[]);assert.deepEqual(designIssues(b,c).notes,[]);
 const r=finishRun(newRun(b),b,c);console.log(c.name,{time:r.time,cost:r.spent,capital:capitalCost(b),delivered:r.delivered});assert.equal(r.success,true,c.name+' is winnable');assert.ok(r.spent<=c.operating);
 for(const n of b.cells.filter(n=>n.kind==='machine')){const s=r.states[n.id];assert.equal(s.busy+s.starved+s.blocked+s.unfunded,r.time,'Time categories account for the shift exactly');}
 let save=newDesignSave();save.designs[c.id]=b;save.mission=c.id;save=recordResult(save,c.id,resultOf(r,b,c));assert.ok(validDesignSave(save),'Completed result persists');
}
// No magic global inventory: deleting a route strands the output and starves downstream.
const b=structuredClone(blueprints[0]);b.links.pop();const blocked=finishRun(newRun(b),b,CHALLENGES[0]);assert.equal(blocked.delivered.rough,undefined);assert.ok(blocked.states[2].blocked>0);assert.ok(blocked.states[2].output<=b.cells[1].capacity);
// Same design and virtual time produce exactly the same outcome at every playback speed.
let fine=newRun(blueprints[1]);for(let i=0;i<320;i++)fine=stepRun(fine,blueprints[1],CHALLENGES[1],1);const coarse=stepRun(newRun(blueprints[1]),blueprints[1],CHALLENGES[1],320);assert.deepEqual(fine,coarse);
// Higher route capacity improves a long transfer, and reservations prevent input overflow.
const p=builder({...FREEPLAY,goals:[{item:'rough',qty:30}]});const src=p.source('blank',30,0,0),mach=p.machine('hob',7,4),sink=p.sink('rough',6,4);p.b.cells.find(c=>c.id===src).interval=2;p.link(src,mach);p.link(mach,sink);const slow=stepRun(newRun(p.b),p.b,FREEPLAY,800);p.b.links[0].carts=3;const quick=stepRun(newRun(p.b),p.b,FREEPLAY,800);assert.ok((quick.delivered.rough||0)>(slow.delivered.rough||0));for(const [id,s]of Object.entries(quick.states))for(const n of Object.values(s.input))assert.ok(n<=p.b.cells.find(c=>c.id===Number(id)).capacity);
assert.equal(connect(p.b,mach,src).error!==undefined,true);assert.equal(validateBlueprint({...p.b,cells:[...p.b.cells,p.b.cells[0]]}),false);assert.equal(validDesignSave({...newDesignSave(),mission:'__proto__'}),false);
console.log('Process design checks passed: all six contracts, explicit routing, blocked outputs, accurate utilization, deterministic playback, cart throughput, and saved results.');
