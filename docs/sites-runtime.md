# Runtime and hosting

## Local execution

Portable development runs Vinext with hot reloading. Hosting workspaces may
provide additional ignored configuration through their deployment tooling.

The public repository intentionally excludes provider-specific preview adapters,
session bridges, deployment identifiers, and hosting manifests. They are not
required to inspect or test the game rules.

## Worker and storage

`build/sites-worker.ts` uses the Vinext fetch handler. The Vite and Cloudflare
plugins build the application Worker. Drizzle schema and immutable SQL migrations
are under `db/` and `drizzle/`; local database state remains ignored.

An authorized deployment workspace may supply `.openai/hosting.json`. A clean
clone has no hosted bindings, so the Vite config falls back to an empty local
configuration. Never commit credentials, production data, deployment identifiers,
or generated runtime state.

## Authentication and publishing

The game expects its hosting platform to provide an authenticated account context.
`lib/game-identity.ts` converts that context into a stable, non-reversible save key,
and the API routes keep player saves isolated. Local verification uses disposable
development data only.

Repository commits do not deploy the hosted game or alter player saves. Publishing
must use an authorized deployment workspace, preserve the existing access policy,
and verify the deployment before it is reported as live.
