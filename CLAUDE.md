# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Repo Overview

A Bun + Turborepo monorepo. `apps/*` holds runnable apps, `packages/*` the shared configs they
extend (`typescript-config`, `oxlint-config`, `oxfmt-config`). Each app/package has its own
`CLAUDE.md` where it has anything to add — read it before working inside one.

One app today: **`apps/llm-translator`** — an Ink (React-for-CLI) + LangChain + Ollama terminal
translator. Its invariants are in [its `CLAUDE.md`](apps/llm-translator/CLAUDE.md) and the _why_
behind them in [`docs/decisions.md`](apps/llm-translator/docs/decisions.md).

The `packages/*` configs are consumed as **package specifiers with subpath exports**, never as
paths into `node_modules`: `@pieceofit/oxlint-config` / `…/react`, `@pieceofit/oxfmt-config` /
`…/react`, `@pieceofit/typescript-config/{base,bun,react,library}.json`. There is deliberately no
aggregating barrel re-exporting them.

## Commands

**`bun` is the only package manager and script runner.** Use `bun run <script>` for scripts and
`bunx <tool>` for one-off binaries — `npm`, `npx`, `yarn` and `pnpm` are not wired up. `bun run`
with no argument lists every script; that list is the source of truth, not this file.

**Run `bun run verify` before considering a task done, from the repo root, and fix what it
reports.** It is the finish line — lint, format, types, unit tests and dead code in one turbo
graph: ~2 s cold, single-digit milliseconds when nothing changed, so there is no cost to running
it often. A green package-level check means nothing while the repo is red, which is why the only
`verify` lives at the root.

| Command                | What it covers                      |
| ---------------------- | ----------------------------------- |
| `bun run verify`       | **everything below** — run this one |
| `bun run check`        | oxlint + oxfmt, whole repo          |
| `bun run fix`          | the autofixable half of `check`     |
| `bun run check-types`  | `tsc` in every package              |
| `bun run check-unused` | knip, whole repo                    |

Scripts that name a tool (`lint`, `format`, `lint:fix`, `format:fix`, `knip`) are the bodies of
turbo tasks, not entry points — calling them directly works but skips the cache. In `turbo.json`
those root-only tasks carry the `//#` prefix; everything without it (`build`, `dev`,
`check-types`, `test:unit`) fans out to the workspaces.

`//#lint` is deliberately not named `lint:root` the way Turborepo's own example does. There the
suffix distinguishes a root task covering only the root directory's files from a `lint` that
fans out to the packages; here a single `oxlint .` covers the whole repo, packages included, so
`:root` would promise less than the task delivers. The plain name also leaves room for a future
package-level `lint` — `turbo run lint` would then pick up both without renaming anything.

**Every tool runs on the Bun runtime, not Node** — `bunfig.toml` sets `[run] bun = true`, so
`vitest`, `turbo`, `tsc`, `oxlint` and `knip` execute on Bun even where they ship a `node`
shebang. Behaviour that depends on the runtime will differ from the same tool run outside the
repo.

**Fixes are yours to run, not the hook's.** `pre-commit` only checks (`oxlint`, `oxfmt --check`,
types, knip) and never writes to your files or stages anything on your behalf; `pre-push` adds
`bun audit` and the unit tests. When a hook fails on style, `bun run fix` and stage the diff
yourself.

### Tests

Vitest, per app. Run them from the app directory (`apps/llm-translator`):

| Command                       | What it does                                                   |
| ----------------------------- | -------------------------------------------------------------- |
| `bun run test:unit`           | the whole suite, once                                          |
| `bun run test:unit <pattern>` | only files matching the pattern (e.g. `use-chat`)              |
| `bun run test:unit-watch`     | watch mode                                                     |
| `bun run test:unit-coverage`  | coverage; **fails below the thresholds** in `vitest.config.ts` |

**Never `bun test`** — that is Bun's own runner (different runtime, incompatible APIs). The
script is named `test:unit` rather than `test` precisely so IDE runners, which drop the `run`
word, cannot start the wrong one.

## Where checks live

Lint, format and dead-code analysis are **root-level**: `oxlint`, `oxfmt` and `knip` walk the
whole repo in one pass, so they are not repeated per package. A package still owns its _rules_ —
a nested `oxlint.config.ts` / `oxfmt.config.ts` **replaces** the root one for that package's
files rather than merging, and the root run picks it up automatically. What stays per-package is
the check that needs its own `tsconfig`: `tsc --noEmit`, plus that package's tests.

Consequence worth knowing: a package does not report lint, formatting or dead-code problems on
its own. Those surface only from the root.

Those nested configs are **TypeScript** (`oxlint.config.ts`, not `.oxlintrc.json`) for one
reason: only a TS config can `import` a shared preset as a package specifier. Two composition
traps live there — oxlint's top-level `env` is **not** inherited through `extends`, so each app
restates its runtime globals; oxfmt has no `extends` at all and silently ignores the key, so its
presets compose by object spread.

Knip is configured once in the root `knip.json`, with per-workspace settings under `workspaces`.
It cannot be run from inside a package: started there it cannot see the root `catalog` and
reports every `catalog:` dependency as unresolved.

Two things about `turbo.json` that look like oversights and are not. Its root tasks carry
`inputs` that exclude `!**/*.md` — except `//#format`, because **oxfmt formats the ts
code blocks inside markdown**, so `.md` files really are part of that task's input (oxfmt sees
147 files where oxlint sees 118). And there are no umbrella tasks aggregating lint+format: a
root task registered without a matching root script runs as `<NONEXISTENT>`, a silent no-op that
turbo omits from its own task counts. `turbo run` takes several task names at once, so the root
scripts list them (`turbo run lint format`) instead. Don't add explanatory
comments to `turbo.json` — `bun run fix` strips them.

## Adding a package

A new workspace joins the turbo graph by what it declares, nothing else registers it:

- `check-types: "tsc --noEmit"` and, if it has tests, `test:unit: "vitest run"` — these names are
  what `verify` fans out to.
- `tsconfig.json` extending `@pieceofit/typescript-config/<base|bun|react|library>.json`.
- `oxlint`, `oxfmt`, `typescript` as `"catalog:"` dependencies; workspace configs as
  `"workspace:*"`.
- `oxlint.config.ts` / `oxfmt.config.ts` only if its rules differ from the root's.

## Dependencies

`oxlint`, `oxfmt` and `typescript` are pinned once in the Bun `catalog` in the root
`package.json`; packages depend on them with `"catalog:"`. Everything else is pinned exactly —
`bunfig.toml` sets `exact = true`, so `bun add` writes `1.2.3`, not `^1.2.3`. Do not hand-edit
versions to ranges.

## Conventions

Project-agnostic house rules live in `.claude/rules/` and load automatically:
`module-architecture.md` (folder-per-module, barrels, naming, where a helper goes) and
`code-comments.md` (comment the _why_, doc the public surface). Plans are persisted through the
**`plan` skill**, which owns their format and location.

The reasoning behind the non-obvious choices — and the alternatives that were tried and reverted
— lives next to what it explains: tooling decisions (hooks, knip, the nested configs, the
standalone-binary build) in
[`apps/llm-translator/docs/decisions.md`](apps/llm-translator/docs/decisions.md), the root-vs-nested
config split in the comments inside `oxlint.config.ts` / `oxfmt.config.ts`, and the
`deps:reinstall` vs `deps:reset` distinction in [README.md](README.md). Read the relevant one
before changing the tooling setup; several entries exist specifically to stop a plausible-looking
approach from being retried.
