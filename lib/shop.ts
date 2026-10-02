export const ITEMS = {
  billet: { name: '8620 sawn stock set', short: '8620 stock', buy: 12, sell: 0, color: '#8999a5', detail: 'Saw-cut stock for one pinion and wheel. Turn it into gear blanks.' },
  alloyBillet: { name: '4140 Q&T stock set', short: '4140 stock', buy: 38, sell: 0, color: '#a392c0', detail: 'Preconditioned stock. Turn blanks before cutting teeth.' },
  casting: { name: 'Single-stage casting', short: 'Small casting', buy: 25, sell: 0, color: '#ada992', detail: 'Rough housing casting for the machining center.' },
  hardware: { name: 'Single-stage hardware pack', short: 'Small hardware', buy: 30, sell: 0, color: '#a8bda5', detail: 'Shafts, bearings, seals, and fasteners for a single-stage housing.' },
  heavyCasting: { name: 'Two-stage casting', short: 'Large casting', buy: 60, sell: 0, color: '#ada992', detail: 'Rough housing casting for a two-stage reducer.' },
  heavyHardware: { name: 'Two-stage hardware pack', short: 'Large hardware', buy: 80, sell: 0, color: '#a8bda5', detail: 'Two-stage shafts, bearings, seals, and fasteners.' },
  blank: { name: '8620 blank set', short: '8620 blanks', buy: 25, sell: 19, color: '#adb6bf', detail: 'Turned pinion + wheel blanks for one matched gear set.' },
  alloy: { name: '4140 Q&T blank set', short: '4140 blanks', buy: 65, sell: 52, color: '#b7acd8', detail: 'Preconditioned alloy blanks for the nitriding route.' },
  bought: { name: 'Catalog gear set', short: 'Bought gears', buy: 100, sell: 0, color: '#90c1f0', detail: 'Finished stock gears. Fit the utility reducer only.' },
  kit: { name: 'Single-stage housing kit', short: 'Housing kit', buy: 80, sell: 68, color: '#b6bfae', detail: 'Housing, shafts, bearings, seals, and fasteners.' },
  heavyKit: { name: 'Two-stage housing kit', short: 'Heavy housing', buy: 190, sell: 160, color: '#b6bfae', detail: 'Assembly kit for the heavy-duty reducer.' },
  rough: { name: 'Hobbed gear set', short: 'Hobbed gears', buy: 90, sell: 65, color: '#efb55c', detail: 'Cut and deburred. Sell now, shave, or send for carburizing.' },
  shaved: { name: 'Shaved gear set', short: 'Shaved gears', buy: 150, sell: 115, color: '#80d4c0', detail: 'Soft-finished gears for utility reducers and light-duty work.' },
  hardened: { name: 'Carburized gear set', short: 'Hardened gears', buy: 200, sell: 145, color: '#f29a75', detail: 'Carburized, quenched, and tempered. Grind to finish.' },
  commercial: { name: 'Shaved & carburized set', short: 'Commercial hard gears', buy: 0, sell: 190, color: '#e6b38c', detail: 'Soft-shaved before carburizing. A middle tier below hard-ground gears.' },
  ground: { name: 'Ground gear set', short: 'Ground gears', buy: 0, sell: 235, color: '#8ec6fc', detail: 'Case-hardened and ground for precision reducers.' },
  alloyCut: { name: 'Hobbed 4140 set', short: 'Hobbed alloy', buy: 0, sell: 100, color: '#bdadeb', detail: 'Preconditioned alloy teeth ready for pre-nitride grinding.' },
  preNitride: { name: 'Finish-ground 4140 set', short: 'Nitriding-ready', buy: 230, sell: 175, color: '#c1a1fa', detail: 'Finish-ground before the low-distortion nitriding cycle.' },
  nitrided: { name: 'Nitrided gear set', short: 'Nitrided gears', buy: 0, sell: 315, color: '#d5b4fd', detail: 'Finished alloy gear set for heavy-duty reducers.' },
  utility: { name: 'Utility reducer', short: 'Utility reducer', buy: 0, sell: 310, color: '#8cddbf', detail: 'One shaved or catalog gear set + a housing kit.' },
  precision: { name: 'Precision reducer', short: 'Precision reducer', buy: 0, sell: 640, color: '#8ec6fc', detail: 'Requires your own carburized and ground gear set.' },
  industrial: { name: 'Industrial reducer', short: 'Industrial reducer', buy: 0, sell: 465, color: '#e6b38c', detail: 'One commercial hardened gear set + a single-stage housing kit.' },
  hybrid: { name: 'Mixed-stage reducer', short: 'Mixed-stage reducer', buy: 0, sell: 820, color: '#b2ccf4', detail: 'One shop-ground set and one catalog set in a two-stage housing.' },
  heavy: { name: 'Heavy-duty reducer', short: 'Heavy reducer', buy: 0, sell: 1150, color: '#d5b4fd', detail: 'Two of your nitrided gear sets + a two-stage housing kit.' },
} as const;
export type ItemId = keyof typeof ITEMS;
export const ITEM_IDS = Object.keys(ITEMS) as ItemId[];
export const MACHINES = {
  lathe: { name: 'CNC turning cell', short: 'Turning cell', cost: 1800, crew: 450, color: '#c0baa7', detail: 'Turn sawn 8620 or preconditioned 4140 stock into matched blank sets. Saves material cost at the expense of an extra operation.', defaultRecipe: 'turn' },
  mill: { name: 'Housing machining center', short: 'Housing mill', cost: 3600, crew: 700, color: '#a8c49f', detail: 'Machine housing castings, then kit them with purchased shafts, bearings, seals, and fasteners.', defaultRecipe: 'housing' },
  partner: { name: 'Outside machine shop', short: 'Subcontractor', cost: 600, crew: 450, color: '#d6a6a0', detail: 'Send parts out for cutting, shaving, grinding, or nitriding. Your first supplier slot is included; book extra capacity when needed.', defaultRecipe: 'subHob' },
  hobber: { name: 'Gear hobber', short: 'Hobber', cost: 650, crew: 300, color: '#efb55c', detail: 'Cut matched pinions and wheels from 8620 or preconditioned 4140 blanks.', defaultRecipe: 'hob' },
  shaver: { name: 'Gear shaver', short: 'Shaver', cost: 1400, crew: 500, color: '#80d4c0', detail: 'Finish soft teeth after hobbing. This is not a hard-finishing operation.', defaultRecipe: 'shave' },
  outside: { name: 'Outside heat treatment', short: 'Heat-treat vendor', cost: 900, crew: 450, color: '#f29a75', detail: 'Carburizing, quench, temper, and return freight. No furnace investment; longer turnaround.', defaultRecipe: 'outsource' },
  carburizer: { name: 'Carburizing cell', short: 'Carburizer', cost: 10500, crew: 1500, color: '#f29a75', detail: 'Carburize, quench, and temper in-house. Faster turnaround and a lower fee per set.', defaultRecipe: 'carburize' },
  grinder: { name: 'Gear grinder', short: 'Grinder', cost: 4600, crew: 950, color: '#8ec6fc', detail: 'Grind carburized gears to final form, or finish 4140 gears before nitriding.', defaultRecipe: 'grind' },
  nitrider: { name: 'Nitriding furnace', short: 'Nitrider', cost: 15500, crew: 1800, color: '#d5b4fd', detail: 'Nitriding for finish-ground, preconditioned alloy gears. A separate route from carburizing.', defaultRecipe: 'nitride' },
  assembly: { name: 'Assembly & test bench', short: 'Assembly bench', cost: 2200, crew: 750, color: '#8cddbf', detail: 'Build and test reducers. Each design consumes its own bill of materials.', defaultRecipe: 'utilityBuy' },
} as const;
export type MachineId = keyof typeof MACHINES;
export type NodeId = MachineId | 'receiving' | 'shipping';
export const MACHINE_IDS = Object.keys(MACHINES) as MachineId[];
export const NODE_IDS: NodeId[] = ['receiving', ...MACHINE_IDS, 'shipping'];
export type Recipe = { name: string; machine: MachineId; input: Partial<Record<ItemId, number>>; output: ItemId; seconds: number; fee: number; note: string };
export const RECIPES: Record<string, Recipe> = {
  turn: { name: 'Turn 8620 blanks', machine: 'lathe', input: { billet: 1 }, output: 'blank', seconds: 7, fee: 1, note: 'Face, turn, and bore a matched blank set.' },
  turnAlloy: { name: 'Turn 4140 blanks', machine: 'lathe', input: { alloyBillet: 1 }, output: 'alloy', seconds: 9, fee: 2, note: 'Turn preconditioned alloy stock.' },
  housing: { name: 'Machine single-stage housing', machine: 'mill', input: { casting: 1, hardware: 1 }, output: 'kit', seconds: 14, fee: 3, note: 'Machine the casting and prepare its assembly hardware.' },
  heavyHousing: { name: 'Machine two-stage housing', machine: 'mill', input: { heavyCasting: 1, heavyHardware: 1 }, output: 'heavyKit', seconds: 20, fee: 5, note: 'Two-stage bores, mounting faces, and assembly hardware.' },
  subHob: { name: 'Subcontract 8620 hobbing', machine: 'partner', input: { blank: 1 }, output: 'rough', seconds: 18, fee: 28, note: 'A supplier cuts your blanks; freight is included.' },
  subShave: { name: 'Subcontract shaving', machine: 'partner', input: { rough: 1 }, output: 'shaved', seconds: 18, fee: 25, note: 'Soft finishing without a shaver investment.' },
  subGrind: { name: 'Subcontract hard grinding', machine: 'partner', input: { hardened: 1 }, output: 'ground', seconds: 24, fee: 42, note: 'Supplier grinds your hardened gears to finished size.' },
  subPreGrind: { name: 'Subcontract 4140 grinding', machine: 'partner', input: { alloyCut: 1 }, output: 'preNitride', seconds: 22, fee: 38, note: 'Finish the alloy gears before nitriding.' },
  subNitride: { name: 'Subcontract nitriding', machine: 'partner', input: { preNitride: 1 }, output: 'nitrided', seconds: 42, fee: 38, note: 'A specialist nitrides the pre-finished alloy gear set.' },
  rushCarburize: { name: 'Express outside carburizing', machine: 'outside', input: { rough: 1 }, output: 'hardened', seconds: 15, fee: 58, note: 'Pay a rush premium for a faster vendor slot.' },
  industrial: { name: 'Industrial reducer', machine: 'assembly', input: { commercial: 1, kit: 1 }, output: 'industrial', seconds: 15, fee: 8, note: 'A hardened middle-tier reducer without hard grinding.' },
  hybrid: { name: 'Mixed-stage reducer', machine: 'assembly', input: { ground: 1, bought: 1, heavyKit: 1 }, output: 'hybrid', seconds: 21, fee: 12, note: 'Make the demanding stage; buy the catalog stage.' },
  hob: { name: 'Hob 8620 gears', machine: 'hobber', input: { blank: 1 }, output: 'rough', seconds: 8, fee: 0, note: 'Cut + deburr a matched gear set.' },
  hobAlloy: { name: 'Hob 4140 gears', machine: 'hobber', input: { alloy: 1 }, output: 'alloyCut', seconds: 10, fee: 0, note: 'For the finish-grind → nitriding route.' },
  shave: { name: 'Shave soft gears', machine: 'shaver', input: { rough: 1 }, output: 'shaved', seconds: 6, fee: 0, note: 'Finish the soft tooth flanks.' },
  outsource: { name: 'Send out for carburizing', machine: 'outside', input: { rough: 1 }, output: 'hardened', seconds: 36, fee: 28, note: 'Fee includes heat treatment and round-trip freight.' },
  outsourceShaved: { name: 'Send shaved gears for carburizing', machine: 'outside', input: { shaved: 1 }, output: 'commercial', seconds: 36, fee: 28, note: 'Soft finishing followed by carburizing, quench, and temper.' },
  carburizeShaved: { name: 'Carburize shaved gears', machine: 'carburizer', input: { shaved: 1 }, output: 'commercial', seconds: 19, fee: 8, note: 'Make commercial hardened gears without the grinder.' },
  carburize: { name: 'Carburize in-house', machine: 'carburizer', input: { rough: 1 }, output: 'hardened', seconds: 19, fee: 8, note: 'Carburize + quench + temper. Grind afterward.' },
  grind: { name: 'Grind hardened gears', machine: 'grinder', input: { hardened: 1 }, output: 'ground', seconds: 9, fee: 3, note: 'Correct heat-treatment distortion and finish the teeth.' },
  grindCommercial: { name: 'Hard-finish commercial gears', machine: 'grinder', input: { commercial: 1 }, output: 'ground', seconds: 9, fee: 3, note: 'Upgrade shaved-and-hardened gears to the precision tier.' },
  grindAlloy: { name: 'Finish-grind 4140', machine: 'grinder', input: { alloyCut: 1 }, output: 'preNitride', seconds: 8, fee: 3, note: 'Finish geometry before nitriding.' },
  nitride: { name: 'Nitride finished 4140', machine: 'nitrider', input: { preNitride: 1 }, output: 'nitrided', seconds: 24, fee: 10, note: 'Treat a finished, preconditioned gear set.' },
  utilityBuy: { name: 'Utility · bought gears', machine: 'assembly', input: { bought: 1, kit: 1 }, output: 'utility', seconds: 12, fee: 5, note: 'Buy the gears; assemble and test the reducer.' },
  utilityMake: { name: 'Utility · shop-made gears', machine: 'assembly', input: { shaved: 1, kit: 1 }, output: 'utility', seconds: 12, fee: 5, note: 'Same reducer, more margin with your own shaved gears.' },
  precision: { name: 'Precision reducer', machine: 'assembly', input: { ground: 1, kit: 1 }, output: 'precision', seconds: 18, fee: 10, note: 'Requires your own case-hardened, ground gears.' },
  heavy: { name: 'Heavy-duty reducer', machine: 'assembly', input: { nitrided: 2, heavyKit: 1 }, output: 'heavy', seconds: 24, fee: 12, note: 'Two nitrided sets in a two-stage housing.' },
};
export type Plan = { name: string; output: ItemId; steps: [string, number][]; desc: string };
export const PLANS: Record<string, Plan> = {
  rough: { name: 'Unfinished gears', output: 'rough', steps: [['hob',1]], desc: 'Fast cash from a single machine.' },
  shaved: { name: 'Shaved gears', output: 'shaved', steps: [['hob',1],['shave',1]], desc: 'Soft finishing for a better selling price.' },
  commercialOut: { name: 'Shaved + hardened · outside HT', output: 'commercial', steps: [['hob',1],['shave',1],['outsourceShaved',1]], desc: 'A commercial hardened gear without buying a grinder.' },
  commercialIn: { name: 'Shaved + hardened · in-house HT', output: 'commercial', steps: [['hob',1],['shave',1],['carburizeShaved',1]], desc: 'Soft finishing followed by your own carburizing cycle.' },
  groundOut: { name: 'Ground gears · outsource HT', output: 'ground', steps: [['hob',1],['outsource',1],['grind',1]], desc: 'Make precision gears before buying a furnace.' },
  groundIn: { name: 'Ground gears · in-house HT', output: 'ground', steps: [['hob',1],['carburize',1],['grind',1]], desc: 'Replace the outside fee with your own heat-treat cell.' },
  nitrided: { name: 'Nitrided alloy gears', output: 'nitrided', steps: [['hobAlloy',1],['grindAlloy',1],['nitride',1]], desc: 'Preconditioned 4140, finished before nitriding.' },
  utilityBuy: { name: 'Utility reducer · buy gears', output: 'utility', steps: [['utilityBuy',1]], desc: 'Skip gear cutting. Buy catalog sets and assemble.' },
  utilityMake: { name: 'Utility reducer · make gears', output: 'utility', steps: [['hob',1],['shave',1],['utilityMake',1]], desc: 'Lower material cost; more machine time.' },
  precisionOut: { name: 'Precision reducer · outside HT', output: 'precision', steps: [['hob',1],['outsource',1],['grind',1],['precision',1]], desc: 'Your own hardened gears, finished and assembled in-house.' },
  precisionIn: { name: 'Precision reducer · all in-house', output: 'precision', steps: [['hob',1],['carburize',1],['grind',1],['precision',1]], desc: 'Keep the full case-hardened route in your shop.' },
  heavy: { name: 'Heavy-duty reducer', output: 'heavy', steps: [['hobAlloy',2],['grindAlloy',2],['nitride',2],['heavy',1]], desc: 'Two nitrided gear sets per finished reducer.' },
};
// Complete routes also support buying intermediate work or making more upstream parts.
Object.assign(PLANS, {
  blanks: { name: '8620 blanks · turn sawn stock', output: 'blank', steps: [['turn',1]], desc: 'Supply your own hobber, or sell turned blanks.' },
  alloyBlanks: { name: '4140 blanks · turn sawn stock', output: 'alloy', steps: [['turnAlloy',1]], desc: 'Turn preconditioned alloy stock in your own shop.' },
  housing: { name: 'Housing kits · machine castings', output: 'kit', steps: [['housing',1]], desc: 'Make single-stage housings and add purchased hardware.' },
  heavyHousing: { name: 'Two-stage kits · machine castings', output: 'heavyKit', steps: [['heavyHousing',1]], desc: 'Supply large reducer housings from your own machining center.' },
  roughRaw: { name: 'Unfinished gears · from sawn stock', output: 'rough', steps: [['turn',1],['hob',1]], desc: 'Two operations and lower material cost.' },
  roughSub: { name: 'Unfinished gears · subcontract cutting', output: 'rough', steps: [['subHob',1]], desc: 'Earn from gears before owning a hobber, or use an overflow supplier.' },
  shavedBuy: { name: 'Shaved gears · buy hobbed sets', output: 'shaved', steps: [['shave',1]], desc: 'Buy unfinished gears and add the soft-finishing operation.' },
  shavedSub: { name: 'Shaved gears · outside finishing', output: 'shaved', steps: [['hob',1],['subShave',1]], desc: 'Use your hobber and let a supplier do the shaving.' },
  groundBuy: { name: 'Ground gears · buy hardened sets', output: 'ground', steps: [['grind',1]], desc: 'Skip cutting and heat treatment; focus on hard finishing.' },
  groundSub: { name: 'Ground gears · outside finishing', output: 'ground', steps: [['hob',1],['outsource',1],['subGrind',1]], desc: 'Reach the ground tier with only a hobber in your shop.' },
  groundRush: { name: 'Ground gears · express heat treatment', output: 'ground', steps: [['hob',1],['rushCarburize',1],['grind',1]], desc: 'Higher process cost for faster turnaround at the heat-treat vendor.' },
  groundFullSub: { name: 'Ground gears · fully subcontracted', output: 'ground', steps: [['subHob',1],['outsource',1],['subGrind',1]], desc: 'Your parts move between two suppliers. No cutting equipment required.' },
  nitrideSub: { name: 'Nitrided gears · outside treatment', output: 'nitrided', steps: [['hobAlloy',1],['grindAlloy',1],['subNitride',1]], desc: 'Make and finish the gears; send out for nitriding.' },
  nitrideBuy: { name: 'Nitrided gears · buy pre-finished sets', output: 'nitrided', steps: [['nitride',1]], desc: 'Buy ready-to-treat alloy gears and run your furnace.' },
  nitrideLowCap: { name: 'Nitrided gears · subcontract finish + treat', output: 'nitrided', steps: [['hobAlloy',1],['subPreGrind',1],['subNitride',1]], desc: 'Use one hobber and outside specialists for the rest.' },
  utilityFinish: { name: 'Utility reducer · buy shaved sets', output: 'utility', steps: [['utilityMake',1]], desc: 'Use purchased shaved sets at your assembly bench.' },
  utilityIntegrated: { name: 'Utility reducer · make blanks + housing', output: 'utility', steps: [['turn',1],['housing',1],['hob',1],['shave',1],['utilityMake',1]], desc: 'Turn stock, machine the housing, cut and finish gears, then assemble.' },
  industrialOut: { name: 'Industrial reducer · outside HT', output: 'industrial', steps: [['hob',1],['shave',1],['outsourceShaved',1],['industrial',1]], desc: 'Shaved and case-hardened gears for a midrange reducer.' },
  industrialIn: { name: 'Industrial reducer · in-house HT', output: 'industrial', steps: [['hob',1],['shave',1],['carburizeShaved',1],['industrial',1]], desc: 'A complete commercial-grade route using your own furnace.' },
  precisionSub: { name: 'Precision reducer · subcontract finishing', output: 'precision', steps: [['hob',1],['outsource',1],['subGrind',1],['precision',1]], desc: 'Cut your gears; outsource heat treatment and grinding; assemble in-house.' },
  precisionIntegrated: { name: 'Precision reducer · stock to gearbox', output: 'precision', steps: [['turn',1],['housing',1],['hob',1],['carburize',1],['grind',1],['precision',1]], desc: 'Make the blanks, housing, and finished gears in your shop.' },
  hybridOut: { name: 'Mixed-stage reducer · make + buy', output: 'hybrid', steps: [['hob',1],['outsource',1],['grind',1],['hybrid',1]], desc: 'Combine a shop-ground set with a purchased catalog set.' },
  hybridIntegrated: { name: 'Mixed-stage reducer · machine housing', output: 'hybrid', steps: [['heavyHousing',1],['hob',1],['carburize',1],['grind',1],['hybrid',1]], desc: 'Make the large housing and precision stage; buy the second gear set.' },
  heavySub: { name: 'Heavy-duty reducer · outside nitriding', output: 'heavy', steps: [['hobAlloy',2],['grindAlloy',2],['subNitride',2],['heavy',1]], desc: 'Build the heavy reducer without buying a nitriding furnace.' },
  heavyIntegrated: { name: 'Heavy-duty reducer · stock to gearbox', output: 'heavy', steps: [['turnAlloy',2],['heavyHousing',1],['hobAlloy',2],['grindAlloy',2],['nitride',2],['heavy',1]], desc: 'Make both alloy gear sets and the two-stage housing.' },
} satisfies Record<string,Plan>);
export const ORDERS: { name: string; buyer: string; item: ItemId; quantity: number; pay: number }[] = [
  { name: 'Repair-shop spares', buyer: 'County Machinery', item: 'rough', quantity: 5, pay: 450 },
  { name: 'Mixer drive gears', buyer: 'Atlas Process Equipment', item: 'shaved', quantity: 5, pay: 800 },
  { name: 'Conveyor reducers', buyer: 'Dockside Handling', item: 'utility', quantity: 3, pay: 1250 },
  { name: 'Precision drives', buyer: 'Meridian Machine Tools', item: 'precision', quantity: 3, pay: 2750 },
  { name: 'Heavy-duty winches', buyer: 'North Coast Marine', item: 'heavy', quantity: 2, pay: 3200 },
  { name: 'Packaging-line upgrade', buyer: 'Larch Packaging', item: 'industrial', quantity: 4, pay: 2450 },
  { name: 'Two-stage conveyor drives', buyer: 'Red Oak Aggregates', item: 'hybrid', quantity: 3, pay: 3300 },
  { name: 'Precision gear replenishment', buyer: 'Horizon Motion', item: 'ground', quantity: 8, pay: 2350 },
  { name: 'Hardened spare sets', buyer: 'Westline Service', item: 'commercial', quantity: 6, pay: 1500 },
];
export type Stock = Record<ItemId, number>;
export type Job = { id: number; recipe: string; start: number; finish: number };
export type Station = { count: number; crew: boolean; auto: boolean; recipe: string; queue: { id:number; recipe: string; qty: number }[]; jobs: Job[]; completed: number; paused:boolean; strict:boolean; level:number; limit:number; repeat:string[]; cursor:number };
export type Move = { id: number; item: ItemId; qty: number; from: NodeId; to: NodeId; start: number; end: number; kind: 'feed' | 'buy' | 'sale'; value: number; order?: number };
export type Shop = { version: 3; cash: number; revenue: number; spent: number; last: number; nextId: number; bins: Record<NodeId, Stock>; stations: Record<MachineId, Station>; moves: Move[]; sold: Stock; made: Stock; buyer: boolean; clerk: boolean; restock: Record<ItemId, boolean>; selling: Record<ItemId, boolean>; keep: Record<ItemId, number>; reorder: Record<ItemId,number>; target: Record<ItemId,number>; reserve:number; handling:number; orders: number[]; log: { id: number; time: number; text: string }[] };
export const CASH = (v: number) => '$' + (v >= 1e6 ? (v/1e6).toLocaleString('en-US',{maximumFractionDigits:2}) + 'M' : v >= 10000 ? (v/1000).toLocaleString('en-US',{maximumFractionDigits:1}) + 'K' : Math.floor(v).toLocaleString('en-US'));
const zeroStock = () => Object.fromEntries(ITEM_IDS.map(id => [id,0])) as Stock;
export function newShop(now = Date.now()): Shop {
  const bins = Object.fromEntries(NODE_IDS.map(id => [id,zeroStock()])) as Record<NodeId, Stock>;
  bins.receiving.blank = 12;
  return { version:3, cash:2000, revenue:0, spent:0, last:now, nextId:1, bins, stations:Object.fromEntries(MACHINE_IDS.map(id => [id,{count:id==='outside'||id==='partner'?1:0,crew:false,auto:false,recipe:MACHINES[id].defaultRecipe,queue:[],jobs:[],completed:0,paused:false,strict:false,level:0,limit:100,repeat:[MACHINES[id].defaultRecipe],cursor:0}])) as unknown as Record<MachineId, Station>, moves:[],sold:zeroStock(),made:zeroStock(),buyer:false,clerk:false,restock:Object.fromEntries(ITEM_IDS.map(id=>[id,false])) as Record<ItemId,boolean>,selling:Object.fromEntries(ITEM_IDS.map(id=>[id,false])) as Record<ItemId,boolean>,keep:Object.fromEntries(ITEM_IDS.map(id=>[id,2])) as Record<ItemId,number>, reorder:Object.fromEntries(ITEM_IDS.map(id=>[id,3])) as Record<ItemId,number>,target:Object.fromEntries(ITEM_IDS.map(id=>[id,10])) as Record<ItemId,number>,reserve:150,handling:0, orders:ORDERS.map(()=>0), log:[{id:0,time:now,text:'Shop lease signed. Twelve blank sets are on the receiving rack.'}] };
}
export function stock(g: Shop, item: ItemId) { return NODE_IDS.reduce((n,id)=>n+g.bins[id][item],0); }
export function incoming(g: Shop,item: ItemId) { return g.moves.filter(m=>m.item===item&&m.kind==='buy').reduce((n,m)=>n+m.qty,0); }
export function nodeStock(g: Shop,id: NodeId) { return ITEM_IDS.reduce((n,item)=>n+g.bins[id][item],0); }
export function queueSize(station: Station) { return station.queue.reduce((n,q)=>n+q.qty,0); }
export function equipmentCost(g: Shop,id: MachineId) { return Math.ceil(MACHINES[id].cost * 1.65 ** g.stations[id].count); }
export const isVendor = (id:MachineId) => id==='outside'||id==='partner';
export function transferTime(g:Shop) {return 2400/(1+g.handling*.5);}
export function cycleSeconds(g:Shop,recipe:string) {return RECIPES[recipe].seconds/(1+g.stations[RECIPES[recipe].machine].level*.25);}
export function upgradeCost(g:Shop,id:MachineId) {return Math.ceil(MACHINES[id].cost*.6*(g.stations[id].level+1));}
export function resaleValue(g:Shop,id:MachineId) {return Math.floor(MACHINES[id].cost*1.65**(g.stations[id].count-1)*.6);}
export function routeCapacity(g:Shop,plan:string) {
  const times:Partial<Record<MachineId,number>>={};
  for(const [r,n] of PLANS[plan].steps){const id=RECIPES[r].machine;times[id]=(times[id]||0)+n*(cycleSeconds(g,r)+transferTime(g)/1000);}
  const loads=Object.entries(times).map(([id,seconds])=>({id:id as MachineId,seconds:seconds!/Math.max(1,g.stations[id as MachineId].count)})).sort((a,b)=>b.seconds-a.seconds);
  return {bottleneck:loads[0].id,perMinute:60/loads[0].seconds,lead:PLANS[plan].steps.reduce((n,[r,q])=>n+q*(cycleSeconds(g,r)+transferTime(g)/1000),0)};
}
function log(g: Shop,time:number,text:string) { g.log.unshift({id:g.nextId++,time,text});g.log=g.log.slice(0,18); }
function pay(g: Shop,value:number) { if(g.cash<value)return false;g.cash-=value;g.spent+=value;return true; }
function transfer(g:Shop,item:ItemId,qty:number,to:NodeId,time:number,kind:'feed'|'sale',value=0,order?:number) {
  let remaining=qty;
  for(const from of NODE_IDS) {
    const take=Math.min(g.bins[from][item],remaining);if(!take)continue;
    g.bins[from][item]-=take;remaining-=take;
    g.moves.push({id:g.nextId++,item,qty:take,from,to,start:time,end:time+transferTime(g),kind,value:kind==='sale'?value*take/qty:0,...(order!==undefined?{order}:{})});
    if(!remaining)break;
  }
}
function available(g:Shop,r:Recipe) { return g.cash>=r.fee&&Object.entries(r.input).every(([item,n])=>stock(g,item as ItemId)>=n!); }
export function shortage(g:Shop,recipeId:string):string {
  const r=RECIPES[recipeId];
  const missing=Object.entries(r.input).filter(([item,n])=>stock(g,item as ItemId)<n!).map(([item,n])=>`${n! - stock(g,item as ItemId)} ${ITEMS[item as ItemId].short.toLowerCase()}`);
  if(g.cash<r.fee)missing.push(`${CASH(r.fee)} processing fee`);
  return missing.length?'Needs '+missing.join(' + '):'Ready for work';
}
function startJob(g:Shop,id:MachineId,recipeId:string,time:number) {
  const r=RECIPES[recipeId];pay(g,r.fee);
  for(const [item,n] of Object.entries(r.input))transfer(g,item as ItemId,n!,id,time,'feed');
  g.stations[id].jobs.push({id:g.nextId++,recipe:recipeId,start:time+transferTime(g),finish:time+transferTime(g)+cycleSeconds(g,recipeId)*1000});
}
function buy(g:Shop,item:ItemId,qty:number,time:number,express=false) {
  if(!ITEMS[item].buy||stock(g,item)+incoming(g,item)+qty>9999||!pay(g,Math.ceil(ITEMS[item].buy*qty*(express?1.2:1))))return false;
  g.moves.push({id:g.nextId++,item,qty,from:'shipping',to:'receiving',start:time,end:time+(express?1800:6500),kind:'buy',value:0});return true;
}
function pump(g:Shop,time:number) {
  // Reserve inputs for downstream machines before selling any excess stock.
  for(const id of [...MACHINE_IDS].reverse()) {
    const s=g.stations[id];if(!s.count||s.paused)continue;
    while(s.jobs.length<s.count) {
      const index=s.strict?(s.queue[0]&&available(g,RECIPES[s.queue[0].recipe])?0:-1):s.queue.findIndex(q=>available(g,RECIPES[q.recipe]));
      if(index>=0) { const q=s.queue[index];startJob(g,id,q.recipe,time);if(--q.qty===0)s.queue.splice(index,1); }
      else if(s.auto&&s.crew&&!(s.strict&&s.queue.length)) {
        let chosen=-1;
        for(let n=0;n<s.repeat.length;n++) {const i=(s.cursor+n)%s.repeat.length,r=RECIPES[s.repeat[i]];const inProcess=MACHINE_IDS.reduce((count,id)=>count+g.stations[id].jobs.filter(j=>RECIPES[j.recipe].output===r.output).length,0);if(available(g,r)&&stock(g,r.output)+inProcess<s.limit){chosen=i;break;}}
        if(chosen<0)break;startJob(g,id,s.repeat[chosen],time);s.cursor=(chosen+1)%s.repeat.length;
      } else break;
    }
  }
  if(g.buyer)for(const item of ITEM_IDS) {
    const have=stock(g,item)+incoming(g,item);
    if(g.restock[item]&&ITEMS[item].buy&&have<g.reorder[item]&&g.cash>=ITEMS[item].buy+g.reserve) {
      const qty=Math.min(g.target[item]-have,Math.floor((g.cash-g.reserve)/ITEMS[item].buy));if(qty>0)buy(g,item,qty,time);
    }
  }
  if(g.clerk)for(const item of ITEM_IDS) {
    const qty=stock(g,item)-g.keep[item];
    if(g.selling[item]&&ITEMS[item].sell&&qty>0)transfer(g,item,qty,'shipping',time,'sale',ITEMS[item].sell*qty);
  }
}
export function advanceShop(previous:Shop,now=Date.now()):Shop {
  const g=structuredClone(previous);const end=Math.max(g.last,Math.min(now,g.last+8*3600*1000));let t=g.last;
  pump(g,t);
  let iterations=0;
  while(iterations++<500000) {
    const next=Math.min(...g.moves.map(m=>m.end),...MACHINE_IDS.flatMap(id=>g.stations[id].jobs.map(j=>j.finish)));
    if(!Number.isFinite(next)||next>end)break;t=next;
    const arrived=g.moves.filter(m=>m.end<=t);g.moves=g.moves.filter(m=>m.end>t);
    for(const move of arrived) {
      if(move.kind==='buy')g.bins.receiving[move.item]+=move.qty;
      if(move.kind==='sale') {g.cash+=move.value;g.revenue+=move.value;g.sold[move.item]+=move.qty;}
    }
    // A split contract shipment is complete once all of its parcels have arrived.
    for(const index of new Set(arrived.filter(m=>m.order!==undefined).map(m=>m.order!))) {
      if(!g.moves.some(m=>m.order===index)) {g.orders[index]++;log(g,t,`${ORDERS[index].name} delivered. ${CASH(ORDERS[index].pay)} received.`);}
    }
    for(const id of MACHINE_IDS) {
      const station=g.stations[id];const finished=station.jobs.filter(j=>j.finish<=t);station.jobs=station.jobs.filter(j=>j.finish>t);
      for(const job of finished) {const output=RECIPES[job.recipe].output;g.bins[id][output]++;g.made[output]++;station.completed++;}
    }
    pump(g,t);
  }
  const skipped=Math.max(0,now-end);
  if(skipped){for(const m of g.moves){m.start+=skipped;m.end+=skipped;}for(const id of MACHINE_IDS)for(const j of g.stations[id].jobs){j.start+=skipped;j.finish+=skipped;}}
  g.last=Math.max(previous.last,now);return g;
}
export function missingMachines(g:Shop,plan:string) { return [...new Set(PLANS[plan].steps.map(([r])=>RECIPES[r].machine))].filter(id=>!g.stations[id].count); }
export function planMaterials(plan:string,qty=1):Partial<Stock> {
  const net:Partial<Stock>={};
  for(const [id,multiple]of PLANS[plan].steps) {const r=RECIPES[id];for(const [item,n]of Object.entries(r.input))net[item as ItemId]=(net[item as ItemId]||0)+n!*multiple*qty;net[r.output]=(net[r.output]||0)-multiple*qty;}
  return Object.fromEntries(Object.entries(net).filter(([item,n])=>n!>0&&ITEMS[item as ItemId].buy>0));
}
export function planCost(plan:string) {return Object.entries(planMaterials(plan)).reduce((n,[item,q])=>n+ITEMS[item as ItemId].buy*q!,0)+PLANS[plan].steps.reduce((n,[r,q])=>n+RECIPES[r].fee*q,0);}
export type ShopAction =
  | {type:'install'|'hire'|'toggleAuto'|'clearQueue'|'pause'|'upgrade'|'sellMachine'|'queueMode';machine:MachineId}
  | {type:'priority'|'removeJob';machine:MachineId;id:number}
  | {type:'buffer';machine:MachineId;quantity:number}
  | {type:'selectRecipe';machine:MachineId;recipe:string}
  | {type:'queue';recipe:string;quantity:number}
  | {type:'plan'|'supplyPlan';plan:string;quantity:number}
  | {type:'automatePlan';plan:string}
  | {type:'buy'|'sell'|'return';item:ItemId;quantity:number;express?:boolean}
  | {type:'restock'|'autosell';item:ItemId;enabled:boolean}
  | {type:'keep'|'reorder'|'target';item:ItemId;quantity:number}
  | {type:'reserve';quantity:number}
  | {type:'handling'}
  | {type:'hireBuyer'|'hireClerk'}
  | {type:'order';index:number};
export function isShopAction(a:unknown):a is ShopAction {
  if(!a||typeof a!=='object')return false;const x=a as Record<string,unknown>;
  const quantity=Number.isInteger(x.quantity)&&Number(x.quantity)>=1&&Number(x.quantity)<=100;
  switch(x.type){
    case 'install':case 'hire':case 'toggleAuto':case 'clearQueue':case 'pause':case 'upgrade':case 'sellMachine':case 'queueMode':return MACHINE_IDS.includes(x.machine as MachineId);
    case 'priority':case 'removeJob':return MACHINE_IDS.includes(x.machine as MachineId)&&Number.isSafeInteger(x.id)&&Number(x.id)>0;
    case 'buffer':return MACHINE_IDS.includes(x.machine as MachineId)&&quantity;
    case 'reserve':return Number.isInteger(x.quantity)&&Number(x.quantity)>=0&&Number(x.quantity)<=10000;
    case 'handling':return true;
    case 'selectRecipe':return MACHINE_IDS.includes(x.machine as MachineId)&&typeof x.recipe==='string'&&Object.hasOwn(RECIPES,x.recipe)&&RECIPES[x.recipe].machine===x.machine;
    case 'queue':return quantity&&typeof x.recipe==='string'&&Object.hasOwn(RECIPES,x.recipe);
    case 'automatePlan':return typeof x.plan==='string'&&Object.hasOwn(PLANS,x.plan);
    case 'plan':case 'supplyPlan':return quantity&&typeof x.plan==='string'&&Object.hasOwn(PLANS,x.plan);
    case 'buy':case 'sell':case 'return':return quantity&&ITEM_IDS.includes(x.item as ItemId)&&(x.express===undefined||typeof x.express==='boolean');
    case 'restock':case 'autosell':return ITEM_IDS.includes(x.item as ItemId)&&typeof x.enabled==='boolean';
    case 'keep':case 'reorder':case 'target':return ITEM_IDS.includes(x.item as ItemId)&&Number.isInteger(x.quantity)&&Number(x.quantity)>=0&&Number(x.quantity)<=100;
    case 'hireBuyer':case 'hireClerk':return true;
    case 'order':return Number.isInteger(x.index)&&Number(x.index)>=0&&Number(x.index)<ORDERS.length;
    default:return false;
  }
}
export function shopAction(previous:Shop,a:ShopAction,now=Date.now()):{state:Shop;ok:boolean;message:string} {
  let g=advanceShop(previous,now);let message='';let ok=false;
  if(!isShopAction(a))return {state:g,ok:false,message:'Unknown shop action.'};
  switch(a.type) {
    case 'install': {const s=g.stations[a.machine];const price=equipmentCost(g,a.machine);if(s.count>=3){message='Three machines are the limit for this cell.';break;}if(pay(g,price)){s.count++;ok=true;message=`${MACHINES[a.machine].short} installed. ${s.count} machine${s.count>1?'s':''} in this cell.`;}break;}
    case 'hire': {const s=g.stations[a.machine];if(s.count&&!s.crew&&pay(g,MACHINES[a.machine].crew)){s.crew=true;ok=true;message='Crew hired. Enable repeat production and choose their recipe.';}break;}
    case 'toggleAuto': {const s=g.stations[a.machine];if(s.count&&s.crew){s.auto=!s.auto;ok=true;}break;}
    case 'clearQueue':g.stations[a.machine].queue=[];ok=true;message='Waiting jobs cleared. Work already on the machine will finish.';break;
    case 'selectRecipe':g.stations[a.machine].recipe=a.recipe;g.stations[a.machine].repeat=[a.recipe];g.stations[a.machine].cursor=0;ok=true;break;
    case 'queue': {const r=RECIPES[a.recipe];const s=g.stations[r.machine];if(!s.count){message=`Install the ${MACHINES[r.machine].short.toLowerCase()} first.`;break;}if(queueSize(s)+a.quantity>200){message='This cell already has a full queue.';break;}s.queue.push({id:g.nextId++,recipe:a.recipe,qty:a.quantity});ok=true;message=`${a.quantity} work order${a.quantity>1?'s':''} queued.`;break;}
    case 'plan': {const missing=missingMachines(g,a.plan);if(missing.length){message='Install '+missing.map(id=>MACHINES[id].short).join(', ')+'.';break;}const needs:Partial<Record<MachineId,number>>={};for(const[r,n]of PLANS[a.plan].steps){const id=RECIPES[r].machine;needs[id]=(needs[id]||0)+n*a.quantity;}if(Object.entries(needs).some(([id,n])=>queueSize(g.stations[id as MachineId])+n!>200)){message='A cell has a full queue. Clear or finish some waiting work.';break;}for(const[r,n]of PLANS[a.plan].steps)g.stations[RECIPES[r].machine].queue.push({id:g.nextId++,recipe:r,qty:n*a.quantity});ok=true;message=`Route queued for ${a.quantity} ${ITEMS[PLANS[a.plan].output].short.toLowerCase()}.`;break;}
    case 'automatePlan': {const ids=[...new Set(PLANS[a.plan].steps.map(([r])=>RECIPES[r].machine))];if(ids.some(id=>!g.stations[id].count)){message='Install every machine in this route first.';break;}const cost=ids.reduce((n,id)=>n+(g.stations[id].crew?0:MACHINES[id].crew),0);if(!pay(g,cost)){message=`Route crews cost ${CASH(cost)}.`;break;}for(const id of ids){const st=g.stations[id];st.crew=true;st.auto=true;st.paused=false;st.repeat=PLANS[a.plan].steps.filter(([r])=>RECIPES[r].machine===id).flatMap(([r,n])=>Array(n).fill(r));st.recipe=st.repeat[0];st.cursor=0;}ok=true;message='Route crews are repeating production. Keep inputs supplied and ship the finished stock.';break;}
    case 'supplyPlan': {const needs=Object.entries(planMaterials(a.plan,a.quantity)).map(([i,n])=>[i,Math.max(0,n!-stock(g,i as ItemId)-incoming(g,i as ItemId))] as [ItemId,number]);const cost=needs.reduce((n,[i,q])=>n+ITEMS[i].buy*q,0);if(!cost){message='All required purchased materials are already here or on the way.';break;}if(cost>g.cash){message=`Materials cost ${CASH(cost)}.`;break;}for(const[i,q]of needs)if(q)buy(g,i,q,now);ok=true;message=`Materials ordered for ${CASH(cost)}. Delivery in 6.5 seconds.`;break;}
    case 'buy':ok=buy(g,a.item,a.quantity,now,a.express);if(ok)message=`${a.quantity} ${ITEMS[a.item].short.toLowerCase()} ordered.`;break;
    case 'sell': {const q=Math.min(a.quantity,stock(g,a.item));if(q&&ITEMS[a.item].sell){transfer(g,a.item,q,'shipping',now,'sale',q*ITEMS[a.item].sell);ok=true;message=`Shipping ${q} ${ITEMS[a.item].short.toLowerCase()} for ${CASH(q*ITEMS[a.item].sell)}.`;}break;}
    case 'hireBuyer':if(!g.buyer&&pay(g,900)){g.buyer=true;ok=true;message='Buyer hired. Pick materials to replenish in the stockroom.';}break;
    case 'hireClerk':if(!g.clerk&&pay(g,700)){g.clerk=true;ok=true;message='Shipping clerk hired. Choose what to sell and how much to keep.';}break;
    case 'restock':if(g.buyer&&ITEMS[a.item].buy){g.restock[a.item]=a.enabled;ok=true;}break;
    case 'autosell':if(g.clerk&&ITEMS[a.item].sell){g.selling[a.item]=a.enabled;ok=true;}break;
    case 'keep':g.keep[a.item]=a.quantity;ok=true;break;
    case 'reorder':g.reorder[a.item]=a.quantity;g.target[a.item]=Math.max(g.target[a.item],a.quantity);ok=true;break;
    case 'target':g.target[a.item]=a.quantity;g.reorder[a.item]=Math.min(g.reorder[a.item],a.quantity);ok=true;break;
    case 'reserve':g.reserve=a.quantity;ok=true;break;
    case 'handling':if(g.handling<3&&pay(g,800*(g.handling+1))){g.handling++;ok=true;message='Material handling upgraded. New transfers move faster.';}break;
    case 'pause':g.stations[a.machine].paused=!g.stations[a.machine].paused;ok=true;message=g.stations[a.machine].paused?'Cell paused. Active jobs will finish; new jobs will wait.':'Cell resumed.';break;
    case 'queueMode':g.stations[a.machine].strict=!g.stations[a.machine].strict;ok=true;break;
    case 'buffer':g.stations[a.machine].limit=a.quantity;ok=true;break;
    case 'priority':case 'removeJob': {const s=g.stations[a.machine],i=s.queue.findIndex(q=>q.id===a.id);if(i<0){message='That work order has already started.';break;}const [q]=s.queue.splice(i,1);if(a.type==='priority')s.queue.unshift(q);ok=true;message=a.type==='priority'?'Work order moved to the front.':'Waiting work order removed.';break;}
    case 'upgrade': {const s=g.stations[a.machine];if(s.count&&s.level<3&&pay(g,upgradeCost(g,a.machine))){s.level++;ok=true;message=`${MACHINES[a.machine].short} upgraded. New cycles run ${s.level*25}% faster than base speed.`;}break;}
    case 'sellMachine': {const s=g.stations[a.machine];if(isVendor(a.machine)){message='Supplier slots cannot be resold.';break;}if(!s.count||s.jobs.length||s.queue.length||s.auto){message='Turn off repeat production and finish or clear all jobs before selling a machine.';break;}const value=resaleValue(g,a.machine);g.cash+=value;s.count--;ok=true;message=`One ${MACHINES[a.machine].short.toLowerCase()} sold for ${CASH(value)}. Crew and upgrades retained.`;break;}
    case 'return': {const qty=Math.min(a.quantity,stock(g,a.item));if(qty&&ITEMS[a.item].buy){const value=Math.floor(ITEMS[a.item].buy*.5)*qty;transfer(g,a.item,qty,'shipping',now,'sale',value);ok=true;message=`Returning ${qty} ${ITEMS[a.item].short.toLowerCase()} for ${CASH(value)} credit.`;}break;}
    case 'order': {const order=ORDERS[a.index];if(g.moves.some(m=>m.order===a.index)){message='That order is already on its way.';break;}if(stock(g,order.item)<order.quantity){message=`Needs ${order.quantity} ${ITEMS[order.item].short.toLowerCase()} in stock.`;break;}transfer(g,order.item,order.quantity,'shipping',now,'sale',order.pay,a.index);ok=true;message=`${order.name} dispatched.`;break;}
  }
  if(ok&&message)log(g,now,message);
  if(ok)g=advanceShop(g,now);
  return {state:g,ok,message:message||(ok?'':'Not enough cash or material for that action.')};
}
const LEGACY_ITEMS = ['blank','alloy','bought','kit','heavyKit','rough','shaved','hardened','commercial','ground','alloyCut','preNitride','nitrided','utility','precision','heavy'] as ItemId[];
const LEGACY_MACHINES = ['hobber','shaver','outside','carburizer','grinder','nitrider','assembly'] as MachineId[];
function validateShop(v:unknown,legacy=false):boolean {
  if(!v||typeof v!=='object')return false;const g=v as Shop;
  const items=legacy?LEGACY_ITEMS:ITEM_IDS,machines=legacy?LEGACY_MACHINES:MACHINE_IDS,nodes:NodeId[]=['receiving',...machines,'shipping'];
  const num=(v:unknown,max=1e15)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=max;
  const int=(v:unknown,max=1e9)=>num(v,max)&&Number.isInteger(v);
  const stockOk=(s:unknown)=>!!s&&typeof s==='object'&&items.every(i=>int((s as Stock)[i]));
  const recipe=(r:unknown)=>typeof r==='string'&&Object.hasOwn(RECIPES,r);
  return g.version===(legacy?2:3)&&[g.cash,g.revenue,g.spent].every(v=>num(v))&&num(g.last,Date.now()+120000)&&int(g.nextId)
    &&!!g.bins&&nodes.every(n=>stockOk(g.bins[n]))&&stockOk(g.sold)&&stockOk(g.made)
    &&!!g.stations&&machines.every(id=>{const s=g.stations[id];return s&&(legacy||(typeof s.paused==='boolean'&&typeof s.strict==='boolean'&&int(s.level,3)&&int(s.limit,100)&&s.limit>0&&Array.isArray(s.repeat)&&s.repeat.length>0&&s.repeat.length<=20&&s.repeat.every(r=>recipe(r)&&RECIPES[r].machine===id)&&int(s.cursor,s.repeat.length-1)))&&int(s.completed)&&int(s.count,3)&&typeof s.crew==='boolean'&&typeof s.auto==='boolean'&&(!s.auto||s.crew)&&recipe(s.recipe)&&RECIPES[s.recipe].machine===id&&Array.isArray(s.queue)&&s.queue.length<=200&&s.queue.every(q=>q&&(legacy||int(q.id))&&recipe(q.recipe)&&RECIPES[q.recipe].machine===id&&int(q.qty,200)&&q.qty>0)&&queueSize(s)<=200&&Array.isArray(s.jobs)&&s.jobs.length<=s.count&&s.jobs.every(j=>j&&int(j.id)&&recipe(j.recipe)&&RECIPES[j.recipe].machine===id&&num(j.start)&&num(j.finish)&&j.finish>=j.start);})
    &&Array.isArray(g.moves)&&g.moves.length<=2000&&g.moves.every(m=>m&&int(m.id)&&ITEM_IDS.includes(m.item)&&int(m.qty,9999)&&m.qty>0&&NODE_IDS.includes(m.from)&&NODE_IDS.includes(m.to)&&num(m.start)&&num(m.end)&&m.end>=m.start&&['feed','buy','sale'].includes(m.kind)&&num(m.value)&&(m.order===undefined||int(m.order,ORDERS.length-1)))
    &&typeof g.buyer==='boolean'&&typeof g.clerk==='boolean'&&!!g.restock&&!!g.selling&&!!g.keep&&items.every(i=>typeof g.restock[i]==='boolean'&&typeof g.selling[i]==='boolean'&&int(g.keep[i],100))
    &&(legacy||(int(g.reserve,10000)&&int(g.handling,3)&&!!g.reorder&&!!g.target&&items.every(i=>int(g.reorder[i],100)&&int(g.target[i],100)&&g.reorder[i]<=g.target[i])))
    &&Array.isArray(g.orders)&&g.orders.length===(legacy?5:ORDERS.length)&&g.orders.every(n=>int(n))&&Array.isArray(g.log)&&g.log.length<=18&&g.log.every(l=>l&&int(l.id)&&num(l.time)&&typeof l.text==='string'&&l.text.length<500);
}

export function validShop(v:unknown):v is Shop {return validateShop(v);}
// Version 2 is expanded in place: stock, cash, queues, transport and timestamps survive.
export function upgradeShop(v:unknown):Shop|null {
  if(validShop(v))return v;
  if(!validateShop(v,true))return null;
  const old=structuredClone(v) as Shop, fresh=newShop(old.last);
  const result={...fresh,...old,version:3,reorder:fresh.reorder,target:fresh.target,reserve:150,handling:0} as Shop;
  result.bins=Object.fromEntries(NODE_IDS.map(id=>[id,{...fresh.bins[id],...old.bins[id]}])) as Shop['bins'];
  for(const key of ['sold','made','restock','selling','keep'] as const)Object.assign(result,{[key]:{...fresh[key],...old[key]}});
  result.stations=Object.fromEntries(MACHINE_IDS.map(id=>[id,{...fresh.stations[id],...old.stations[id],repeat:[old.stations[id]?.recipe||MACHINES[id].defaultRecipe],queue:(old.stations[id]?.queue||[]).map(q=>({...q,id:result.nextId++}))}])) as Shop['stations'];
  result.orders=ORDERS.map((_,i)=>old.orders[i]||0);
  return validShop(result)?result:null;
}
