# Agent Guide — Gear Works

## Product direction

Build a persistent machine-shop business for a player who knows gears and
manufacturing. Start with capital and an empty floor; grow equipment, people,
engineering knowledge, inventory, customer relationships, and production
capability in one continuing company. Build-to-print lots, reverse engineering,
engineered design, purchased components, assembly, and house production belong
to that same business. Do not turn the main game back into isolated production
puzzles, reset-on-contract challenges, or an upgrade-clicking idle game.

Read `README.md`, `docs/DESIGN.md`, and relevant source before changing behavior.
`docs/DEVELOPMENT.md` owns setup and verification. `docs/sites-runtime.md` owns
runtime and hosting details. Prices and durations are explicit fictional game
parameters. Use feet/inches, diametral pitch, horsepower, and other appropriate
US customary units in player-facing engineering controls.

## Working discipline

- Find and fix root causes. Do not swallow errors, invent missing data, coerce
  unknown enums, or substitute a different action when the requested action is
  invalid. Surface a useful failure without mutating the company.
- A modeled default is allowed only when the domain defines absence that way.
  Mark new defaulted reads with `// modeled-default: <reason>` at that read.
  The existing sparse inventory maps define an absent item count as zero.
- The engine owns rules and state transitions. UI, narration, and agent tools
  use the same validated commands and queries; they must not independently
  invent finances, cycle results, material movements, or available capacity.
- Preserve deterministic elapsed-time behavior. Keep wall-clock time, network
  access, and browser APIs out of simulation rules. If randomness is introduced,
  make its state explicit and replayable, and report failing seeds.
- Do not add dependencies or reorganize the application without a concrete need.
  Research technical APIs from primary documentation.
- Read engineering sources before implementing a claimed physical rule. Make
  deliberate game simplifications explicit in the owning design document.
- Keep implementation details and development caveats out of normal player flows.

## Saves and information boundaries

- The live company is not a test fixture. Never reset, inspect, export, advance,
  or overwrite the owner's live save to debug a hypothetical scenario.
- Tests create disposable companies and local databases. Never commit player
  saves, database contents, credentials, auth cookies, tokens, transcripts,
  build output, or local execution-profile files.
- Preserve account isolation, optimistic revisions, and in-process work. A stale
  tab must not overwrite a newer company. Do not claim a save succeeded when it
  failed or silently initialize a new company from an unreadable save.
- Application rules read one current state shape. Do not spread compatibility
  branches or fallback fields through the engine and UI.
- Classify schema and rule changes as structural or semantic, including effects
  on money, inventory, jobs, and commitments. A needed schema change is not a
  reason to avoid the right design. Do not automatically wipe a player company
  or write a semantic migration without the owner's instruction. A requested
  migration belongs at the storage boundary and must be explicit and tested.
- Existing game versions have separate routes and save keys. Do not reuse or
  delete those keys as part of an unrelated change.
- Keep the opaque authenticated-subject path in `lib/game-identity.ts` working.
  Provider-specific trust adapters remain outside the public game repository.

## Verification

- Run the smallest meaningful checks for the change, then broaden only to resolve
  a concrete remaining risk. See `docs/DEVELOPMENT.md` for exact commands.
- Never skip, weaken, delete, or defer a failing test to make a change pass. Fix
  the root cause. A pre-existing failure is still a failure to investigate.
- Test observable behavior: money and material conservation, exclusive resource
  use, rejected actions, ordering, replay, persistence, and long-term progression.
  Avoid tests that merely mirror implementation details.
- Use disposable data for browser playthroughs and persistence tests. Report
  the checks actually run; do not claim a browser pass from an engine test.
- Do not add or run GitHub Actions, scheduled CI, or workflow dispatches. Run
  verification locally; the owner's Actions minutes are reserved elsewhere.

## Git, reviews, and work tracking

- The founding source import establishes `main`. Subsequent development belongs
  on a task branch, never directly on `main`. Keep unrelated changes separate.
- Review the entire working diff before opening a PR. Open it ready for review,
  never as a draft. Include the reason for the change, resulting behavior,
  meaningful verification, and a real originating-session link when available;
  never invent one.
- Close resolved issues with a separate `Closes #N` line for each issue. Check
  mergeability after pushing a PR branch and resolve conflicts at the root cause.
- Request `@codex review` after opening a PR and after subsequent pushes, up to
  three review rounds. Keep fixing findings after that cap without requesting
  a fourth round. Respond to findings with the fix and covering test, a linked
  justified issue, or evidence refuting the finding.
- Do not create recurring PR check-ins, timers, or polling automations. Report
  the PR state once, then respond to actual review activity.
- Fix small or related defects encountered during implementation. File instead
  only when a major owner ruling is needed, the work is far too large to include,
  or it is unrelated and not small. Name the reason in the issue. An explicit
  owner request to propose and file improvements, such as the founding backlog,
  authorizes that issue-planning work without implementing the proposed features.
- GitHub issues are the sole home for priorities, dependencies, acceptance
  criteria, and incomplete work: https://github.com/Sovinnai/gear-works/issues.
  No TODO comments, source backlogs, roadmap documents, or future-work sections.
  Documents explain current behavior; edit the owning explanation in place.
- Search existing and recently closed issues before filing. File one issue per
  root cause or cohesive capability. Give evidence, relevant paths, intended
  player decisions, and concrete acceptance criteria.
- Preserve requested scope. Do not use "where feasible", documentation-only
  substitutes, or follow-up issues as escape clauses. A material scope change
  needs evidence and an owner decision.
- Use `bug` or `enhancement` as appropriate. Reserve `decision` for a significant
  owner ruling, `low-priority` for parked work, `umbrella`/`sub-issue` for genuine
  parent/child tracking, and `sonnet` for small, mechanical, unambiguous work.
  When custom labels are unavailable, put the priority explicitly in the title
  and body. Do not invent milestones or claim labels were applied.

## Shared agent guidance

`AGENTS.md` is authoritative. `CLAUDE.md` is an exact copy for Claude-based tools.
After editing this file, run `node scripts/sync-agent-guides.mjs`; use its
`--check` mode to verify equality. This guide adapts the owner's working
agreements in Ars Magica Covenant Simulator and Submarine Command to this
TypeScript game; their game-specific rules and Python commands do not apply here.

The public repository does not contain `.openai/hosting.json`. That manifest
identifies the existing Sites project and its bindings; an authorized hosting
workspace supplies it locally. Never reconstruct, guess, or commit it.
