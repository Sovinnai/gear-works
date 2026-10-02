# Gear Works

A persistent machine-shop business game. Start with **$25,000 and an empty shop**;
build a company around gear cutting, finishing, engineering, reverse engineering,
and gearbox assembly.

[Improvement issues](https://github.com/Sovinnai/gear-works/issues)

## What you can do

- Buy new or used equipment, improve tooling, and expand from six to eighteen bays.
- Hire machinists, assembly technicians, engineers, and inspectors; assign yourself
  to production or office work.
- Quote build-to-print lots, recover obsolete gears, sell engineering services,
  and build gearboxes from bought-in or shop-made components.
- Choose complete process routes, subcontract operations, and manage outside
  transfer batches while several jobs share the same floor and people.
- Produce house inventory and sell finished products without a customer order.
- Carry payroll, rent, loans, material costs, deposits, and customer balances in
  one continuing business.
- Retain drawings and repeat setups as company assets. Save equipment, staff,
  inventory, unfinished work, finances, and delivery history between sessions.

Time advances only while the visible game is running or through explicit time
controls. The company remains paused while you are away.

## Development

The application uses React, TypeScript, Vinext/Vite, and Cloudflare Workers with
D1 persistence. Dependencies are pinned by `pnpm-lock.yaml`.

Use Node.js 22.13.0 or newer and pnpm 11.25.0. Start with
[Development and verification](docs/DEVELOPMENT.md) for installation, local D1
initialization, sign-in, and test commands.

- [Agent working agreement](AGENTS.md)
- [Current game design](docs/DESIGN.md)
- [Runtime and hosting](docs/sites-runtime.md)

`AGENTS.md` and `CLAUDE.md` contain identical instructions. No GitHub Actions
workflows are used; verification runs locally. Future work and acceptance
criteria live in GitHub issues.

## Source map

| Area | Location |
| --- | --- |
| Career simulation and decisions | `lib/career.ts` |
| Parts, machines, recipes, and routes | `lib/shop.ts` |
| Company screens and material movement | `app/career-*.tsx`, `app/career.css` |
| Main game and elapsed-time controls | `app/page.tsx` |
| Account saves and revisions | `app/api/career/route.ts`, `app/use-career.ts` |
| Authenticated account identity | `lib/game-identity.ts` |
| Disposable simulation and Worker tests | `tests/` |

Earlier game versions remain at `/design`, `/idle`, and `/classic`, each with a
separate save namespace. The main game is the continuing machine-shop company.

The public repository contains the game and portable development setup. Deployment
configuration is maintained separately, and GitHub changes do not publish a hosted
instance automatically.
