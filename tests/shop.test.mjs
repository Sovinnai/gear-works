import assert from 'node:assert/strict';
import {newShop,advanceShop,shopAction,stock,ITEM_IDS,ITEMS,MACHINE_IDS,RECIPES,PLANS,planMaterials,validShop,isShopAction} from '../lib/shop.ts';
const now=Date.now()-1000*3600*72;
const run=(g,a,t=now)=>shopAction(g,a,t);
let g=newShop(now);
assert.ok(validShop(g));
assert.equal(run(g,{type:'queue',recipe:'hob',quantity:1}).ok,false);
g=run(g,{type:'install',machine:'hobber'}).state;
assert.equal(g.cash,1350);
g=run(g,{type:'queue',recipe:'hob',quantity:1}).state;
assert.equal(stock(g,'blank'),11,'Input is reserved immediately');
assert.equal(stock(g,'rough'),0);
assert.equal(g.moves[0].kind,'feed');
assert.equal(g.moves[0].to,'hobber');
g=advanceShop(g,now+10399);assert.equal(stock(g,'rough'),0);
g=advanceShop(g,now+10400);assert.equal(stock(g,'rough'),1);
assert.equal(g.bins.hobber.rough,1,'Finished work stays on its machine rack');
assert.equal(g.cash,1350,'Manufacturing alone does not generate money');
g=run(g,{type:'sell',item:'rough',quantity:1},now+10400).state;
assert.equal(g.cash,1350,'Revenue waits for shipping');assert.equal(stock(g,'rough'),0);
g=advanceShop(g,now+12800);assert.equal(g.cash,1415);
assert.equal(g.revenue,65);
// Queue a downstream operation before the upstream product exists.
let chain=newShop(now);chain.cash=10000;for(const id of ['hobber','shaver'])chain=run(chain,{type:'install',machine:id}).state;
chain=run(chain,{type:'queue',recipe:'shave',quantity:1}).state;
assert.equal(chain.stations.shaver.jobs.length,0);
chain=run(chain,{type:'queue',recipe:'hob',quantity:1}).state;
chain=advanceShop(chain,now+10400);
assert.equal(stock(chain,'rough'),0);assert.equal(chain.moves[0].from,'hobber');assert.equal(chain.moves[0].to,'shaver');
chain=advanceShop(chain,now+18800);assert.equal(stock(chain,'shaved'),1);
assert.equal(chain.bins.shaver.shaved,1);
// Every complete route consumes the bill of materials, produces the right count,
// and charges only processing fees. No mysterious extra gears or cash.
for(const [name,plan]of Object.entries(PLANS)){
 let s=newShop(now);s.cash=100000;for(const node of Object.values(s.bins))for(const item of ITEM_IDS)node[item]=0;
 for(const id of MACHINE_IDS)s.stations[id].count=1;
 const quantity=3;for(const [item,count]of Object.entries(planMaterials(name,quantity)))s.bins.receiving[item]=count;
 const fees=plan.steps.reduce((n,[r,q])=>n+RECIPES[r].fee*q*quantity,0);
 const result=run(s,{type:'plan',plan:name,quantity});assert.equal(result.ok,true,name);
 s=advanceShop(result.state,now+600000);
 assert.equal(stock(s,plan.output),quantity,name+' output');
 for(const item of ITEM_IDS)if(item!==plan.output)assert.equal(stock(s,item),0,name+' leftover '+item);
 assert.equal(s.cash,100000-fees,name+' processing fees');
 assert.equal(s.moves.length,0);assert.equal(MACHINE_IDS.reduce((n,id)=>n+s.stations[id].jobs.length,0),0);
 assert.ok(validShop(s),name+' valid state');
}
// Outsourced and in-house carburizing produce the same stock at different costs.
assert.equal(RECIPES.outsource.output,RECIPES.carburize.output);
assert.ok(RECIPES.outsource.fee>RECIPES.carburize.fee);
assert.ok(RECIPES.outsource.seconds>RECIPES.carburize.seconds);
assert.equal(RECIPES.shave.input.hardened,undefined,'Hard gears never enter the shaver');
assert.equal(RECIPES.nitride.input.preNitride,1);
assert.equal(RECIPES.precision.input.bought,undefined,'Catalog gears cannot satisfy precision reducer BOM');
// Contracts cannot double-reserve stock or pay early.
let order=newShop(now);order.bins.hobber.rough=5;
order=run(order,{type:'order',index:0}).state;
assert.equal(stock(order,'rough'),0);assert.equal(order.cash,2000);
assert.equal(run(order,{type:'order',index:0}).ok,false);
order=advanceShop(order,now+2400);assert.equal(order.cash,2450);assert.equal(order.orders[0],1);
// Automatic throughput is invariant to tick frequency and stops for missing inputs.
let auto=newShop(now);auto.cash=5000;auto.stations.hobber.count=1;auto.stations.hobber.crew=true;auto.stations.hobber.auto=true;auto.buyer=true;auto.clerk=true;auto.restock.blank=true;auto.selling.rough=true;auto.keep.rough=0;
const coarse=advanceShop(auto,now+120000);let fine=structuredClone(auto);
for(let n=1;n<=1200;n++)fine=advanceShop(fine,now+n*100);
assert.equal(fine.cash,coarse.cash);assert.deepEqual(fine.bins,coarse.bins);assert.deepEqual(fine.sold,coarse.sold);
let limited=newShop(now);limited.bins.receiving.blank=1;limited.stations.hobber.count=1;limited.stations.hobber.crew=true;limited.stations.hobber.auto=true;
limited=advanceShop(limited,now+600000);assert.equal(stock(limited,'rough'),1);assert.equal(limited.stations.hobber.jobs.length,0);
// Eight-hour offline cap must not leave overdue events that replay skipped time.
const start=performance.now();const eight=advanceShop(auto,now+8*3600000);const away=advanceShop(auto,now+48*3600000);
assert.equal(away.cash,eight.cash);assert.deepEqual(away.bins,eight.bins);
assert.ok(away.moves.every(m=>m.end>away.last));assert.ok(MACHINE_IDS.every(id=>away.stations[id].jobs.every(j=>j.finish>away.last)));
const back=advanceShop(away,away.last+1);assert.equal(back.cash,away.cash,'No extra offline payout on next tick');assert.ok(validShop(back));
assert.equal(isShopAction({type:'buy',item:'blank',quantity:-1}),false);assert.equal(isShopAction({type:'plan',plan:'missing',quantity:5}),false);
assert.equal(isShopAction({type:'queue',recipe:'__proto__',quantity:1}),false);
assert.equal(isShopAction({type:'plan',plan:'__proto__',quantity:1}),false);
assert.equal(validShop({...newShop(now),bins:{}}),false);
assert.equal(validShop({...newShop(now),cash:Infinity}),false);
console.log(`Shop tests passed: ${Object.keys(PLANS).length} full routes, material conservation, real transport, contracts, make/buy BOMs, starvation, automation, and offline cap. Offline simulation pair: ${Math.round(performance.now()-start)} ms.`);

// Saved live work upgrades without recreating cash, stock, jobs or shipment clocks.
const {readFileSync}=await import('node:fs');
const {upgradeShop,upgradeCost,resaleValue,transferTime,cycleSeconds}=await import('../lib/shop.ts');
const legacy=JSON.parse(readFileSync(new URL('./shop-v2.fixture.json',import.meta.url),'utf8'));
const upgraded=upgradeShop(legacy);assert.ok(validShop(upgraded));assert.equal(upgraded.version,3);
assert.equal(upgraded.cash,legacy.cash);assert.equal(upgraded.last,legacy.last);
assert.deepEqual(upgraded.moves,legacy.moves);assert.deepEqual(upgraded.stations.hobber.jobs,legacy.stations.hobber.jobs);
assert.equal(upgraded.stations.hobber.queue[0].qty,legacy.stations.hobber.queue[0].qty);
for(const [node,bin]of Object.entries(legacy.bins))for(const [item,count]of Object.entries(bin))assert.equal(upgraded.bins[node][item],count);
assert.equal(upgraded.orders[0],7);assert.equal(upgraded.stations.partner.count,1);assert.equal(upgraded.bins.receiving.billet,0);
assert.equal(upgradeShop({...legacy,cash:-1}),null);assert.deepEqual(upgradeShop(upgraded),upgraded);
assert.equal(stock(advanceShop(upgraded,legacy.last+60000),'rough'),5,'Old queued work finishes after migration');
// A shared subcontractor can alternate upstream and downstream work indefinitely.
for(const name of ['groundFullSub','nitrideLowCap','heavyIntegrated']){
 let s=newShop(now);s.cash=100000;for(const node of Object.values(s.bins))for(const item of ITEM_IDS)node[item]=0;
 for(const id of MACHINE_IDS)s.stations[id].count=1;
 for(const [item,n]of Object.entries(planMaterials(name,3)))s.bins.receiving[item]=n;
 s=run(s,{type:'automatePlan',plan:name}).state;s=advanceShop(s,now+600000);
 assert.equal(stock(s,PLANS[name].output),3,`${name}: mixed repeat recipes keep downstream supplied`);assert.ok(validShop(s));
}
// Priorities, strict FIFO and skip-blocked dispatch have observable different outcomes.
let dispatch=newShop(now);dispatch.stations.hobber.count=1;dispatch.stations.hobber.paused=true;
dispatch=run(dispatch,{type:'queue',recipe:'hobAlloy',quantity:1}).state;
dispatch=run(dispatch,{type:'queue',recipe:'hob',quantity:2}).state;
const firstId=dispatch.stations.hobber.queue[0].id,secondId=dispatch.stations.hobber.queue[1].id;
dispatch=run(dispatch,{type:'queueMode',machine:'hobber'}).state;
dispatch=run(dispatch,{type:'pause',machine:'hobber'}).state;
assert.equal(dispatch.stations.hobber.jobs.length,0,'Strict FIFO waits for unavailable alloy');
dispatch=run(dispatch,{type:'priority',machine:'hobber',id:secondId}).state;
assert.equal(dispatch.stations.hobber.jobs[0].recipe,'hob','Promoted available job starts immediately');
dispatch=run(dispatch,{type:'removeJob',machine:'hobber',id:firstId}).state;
assert.equal(dispatch.stations.hobber.queue.some(q=>q.recipe==='hobAlloy'),false);
dispatch=run(dispatch,{type:'pause',machine:'hobber'}).state;
dispatch=advanceShop(dispatch,now+12000);assert.equal(stock(dispatch,'rough'),1);assert.equal(dispatch.stations.hobber.jobs.length,0,'Pause lets running job finish, holds next');
dispatch=run(dispatch,{type:'pause',machine:'hobber'},now+12000).state;assert.equal(dispatch.stations.hobber.jobs.length,1);
// Upgrades change future cycle and transport time, without moving running deadlines.
let fast=newShop(now);fast.cash=10000;fast.stations.hobber.count=1;
fast=run(fast,{type:'queue',recipe:'hob',quantity:1}).state;const deadline=fast.stations.hobber.jobs[0].finish;
fast=run(fast,{type:'upgrade',machine:'hobber'}).state;assert.equal(fast.stations.hobber.jobs[0].finish,deadline);assert.equal(cycleSeconds(fast,'hob'),6.4);
fast=run(fast,{type:'handling'}).state;assert.equal(transferTime(fast),1600);
assert.equal(run(fast,{type:'sellMachine',machine:'hobber'}).ok,false,'Cannot sell a running machine');
fast=advanceShop(fast,now+20000);const cashBefore=fast.cash,refund=resaleValue(fast,'hobber');
fast=run(fast,{type:'sellMachine',machine:'hobber'},now+20000).state;assert.equal(fast.cash,cashBefore+refund);assert.equal(fast.stations.hobber.count,0);assert.equal(fast.stations.hobber.level,1);
// Express delivery trades margin for arrival time; restock respects custom cash floors.
let delivery=newShop(now);delivery.bins.receiving.blank=0;
delivery=run(delivery,{type:'buy',item:'blank',quantity:5,express:true}).state;assert.equal(delivery.cash,1850);
assert.equal(stock(advanceShop(delivery,now+1799),'blank'),0);assert.equal(stock(advanceShop(delivery,now+1800),'blank'),5);
let purchasing=newShop(now);purchasing.buyer=true;purchasing.bins.receiving.blank=0;purchasing.restock.blank=true;purchasing.reorder.blank=8;purchasing.target.blank=25;purchasing.reserve=1800;
purchasing=advanceShop(purchasing,now);assert.equal(purchasing.cash,1800);assert.equal(purchasing.moves[0].qty,8);
purchasing=advanceShop(purchasing,now+6500);assert.equal(stock(purchasing,'blank'),8);assert.equal(purchasing.moves.length,0);
assert.equal(isShopAction({type:'buffer',machine:'hobber',quantity:0}),false);
assert.equal(isShopAction({type:'priority',machine:'hobber',id:-1}),false);
assert.equal(isShopAction({type:'reserve',quantity:10001}),false);
console.log('Expansion checks passed: v2 save migration, shared-cell repeat mixes, stable queue priorities, pause/resume, upgrades, equipment resale, express freight, and custom replenishment.');
