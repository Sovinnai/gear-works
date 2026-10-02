# Development and verification

## Runtime

Use Node.js 22.13.0 or newer and the `pnpm@11.25.0` version pinned in
`package.json`. From a clean checkout, install with:

```sh
corepack pnpm install --frozen-lockfile
```

If Corepack is not installed, install the pinned pnpm release through the normal
package manager and use `pnpm` in place of `corepack pnpm`. Do not translate the
lockfile into an npm lockfile. The game needs its local D1 table before the first
saved-company playthrough:

```sh
corepack pnpm build
corepack pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_lonely_butterfly.sql
corepack pnpm dev
```

Apply that initial migration once per new local database. Use the loopback URL
printed by the development server. Portable development offers
`/signin-with-chatgpt?return_to=/` for a disposable local identity. Hosted access
continues to use dispatch-owned authentication. The built preview launched by
`pnpm start` does not itself simulate sign-in.

## Focused checks

```sh
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types tests/career.test.mjs
node --experimental-strip-types tests/identity.test.mjs
node scripts/sync-agent-guides.mjs --check
```

Career tests cover persistent business growth, repeat drawings, payroll,
engineering services, reverse-engineering gates, house inventory, bought-in
assembly, exclusive labor capacity, long-running companies, deterministic time,
and recovery from cash-flow pressure.

The catalog is shared with older game modes. If changing catalog entries or
their behavior, also run the affected mode's checks:

```sh
node --experimental-strip-types tests/shop.test.mjs
node --experimental-strip-types tests/process.test.mjs
node --experimental-strip-types tests/game.test.mjs
```

For interface changes, play through the affected flow with disposable data,
checking keyboard interaction and the relevant narrow and wide viewport sizes.
State explicitly whether browser checks were performed. Engine and Worker tests
do not establish visual correctness.

## GitHub and hosting

There are no GitHub Actions workflows. Verification runs locally. Development
uses task branches and ready-for-review pull requests under `AGENTS.md`.

The initial GitHub source snapshot is derived from the published game. Game source
is preserved; repository documentation and agent guidance are adapted for public
development. Generated build caches are excluded.

GitHub commits do not automatically deploy the live game. Publishing to the
existing deployment uses a locally supplied, ignored
`.openai/hosting.json`. Preserve its audience and account data. Never reconstruct
the project identity from documentation or commit it. See
`docs/sites-runtime.md` for runtime details; do not create a second Site merely
because this is a new GitHub checkout.
