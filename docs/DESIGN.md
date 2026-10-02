# Gear Works: current design

## The continuing company

The main game starts with $25,000, six empty bays, and an owner who can work in
any department. The company keeps its equipment, staff, cash, debt, inventory,
drawings, and work in progress across jobs and sessions. The player chooses a
business mix: manufacturing to print, recovering obsolete gears from samples,
engineering services, gearbox assembly, or manufacturing house inventory.

Progression comes from retained productive assets, drawings, completed deliveries,
reputation, larger repeat lots, and the ability to undertake more demanding work.
Purchases, wages, subcontracting, financing, and delivery receipts all affect the
same company. There is no main-game mission reset or separate contract budget.

## Simulation and capacity

`lib/career.ts` owns the deterministic career model. `careerAction` validates and
applies business decisions; `advanceCareer` advances explicit working hours in
three-minute increments. Eight working hours form a day. Live browser playback
and manual time controls both call that engine. Hidden-page time is not caught up.

Jobs share machines and qualified people. An active operation reserves its
operator, machine, and required material. The owner can fill one role at a time.
Shared departmental pools and dedicated machine assignments determine available
staff. Job priority controls allocation of the next available cycle. Setup time
depends on the part and recipe previously run and the existence of repeat work.

In-house operations produce one inventory unit per cycle. Outside machining and
heat treatment each offer two concurrent batches. Whole-lot, single-piece, and
fixed-size transfer batches trade downstream start time against freight charges.
Cart time depends on source and destination bay distance. Material remains tied
to its work order while moving between stores, machines, and outside services.

The catalog in `lib/shop.ts` defines purchased materials, intermediate gears,
housing kits, gearboxes, machines, recipes, and complete manufacturing routes.
One gear set represents a matched pinion and wheel. Current choices include
hobbing, soft shaving, carburizing, hard grinding, and finish-grinding before
nitriding, plus bought-in and shop-made gearbox components.

## Work and engineering

Accepted customer work receives a deposit and enters planning. The player sets
the process route before reserving material, chooses in-house or outside
engineering, reserves stock or buys material, and releases the job. Engineering
precedes production; final inspection precedes shipment and the balance receipt.
House lots instead become unallocated inventory that can be sold later.

In-house reverse engineering requires the metrology package. In-house design
requires the CAD package. Ordinary print review and inspection are included with
the shop. Engineering is currently represented by resource-gated work hours and
product choices. Released drawings are permanent part records; repeat orders
need less review and use shorter repeat setups. Customer inquiries are generated
from the catalog, reputation, and repeat-delivery history.

## Economy

Daily rent, payroll, and loan interest recur every eight working hours. Material,
process fees, recruiting, tooling, equipment, and expansion are separate costs.
Customer deposits arrive on acceptance; balances arrive after delivery. Late
deliveries reduce payment and reputation. Insufficient cash creates operating
arrears, which future receipts settle; employees stop taking new work while
arrears remain. Assets are not erased by a cash shortage.

Company lifetime sales and job direct costs are tracked separately. Reported job
contribution excludes payroll, rent, interest, and capital investment. Prices,
cycle durations, capacity, and financial terms are intentionally game parameters.

## Interface and persistence

`app/page.tsx` coordinates the floor, orders, people, engineering, stock, and
accounts screens. The `app/career-*.tsx` components render decisions and engine
state. `app/use-career.ts` serializes automatic saves, loads validated state, and
blocks stale clients after a revision conflict. In-progress operations, material
transfers, and commitments are part of the saved company.

`/api/career` stores version-1 career state in Cloudflare D1 using the existing
`game_saves` table, a `career-v1:` account namespace, and optimistic revisions.
`lib/game-identity.ts` hashes an opaque authenticated subject into a stable
account key. The deployment boundary must strip client-supplied identity values
and inject only a verified subject.

Earlier games remain isolated: `/design` uses `/api/design`, `/idle` uses
`/api/shop`, and `/classic` uses `/api/game`. Their mechanics and saves are separate
from the company's career mode.
