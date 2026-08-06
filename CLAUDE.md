# CLAUDE.md

## Repo Overview

A Bun + Turborepo monorepo. `apps/*` holds runnable apps, `packages/*` the shared configs they
extend (`typescript-config`, `oxlint-config`, `oxfmt-config`). Each app/package has its own
`CLAUDE.md` where it has anything to add — read it before working inside one.

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

Scripts that name a tool (`quality:lint`, `quality:format`, `fix:lint`, `fix:format`, `knip`) are
the bodies of turbo tasks, not entry points — calling them directly works but skips the cache.

**Fixes are yours to run, not the hook's.** `pre-commit` only checks (`oxlint`, `oxfmt --check`,
types, knip) and never writes to your files or stages anything on your behalf; `pre-push` adds
`bun audit` and the unit tests. When a hook fails on style, `bun run fix` and stage the diff
yourself.

## Where checks live

Lint, format and dead-code analysis are **root-level**: `oxlint`, `oxfmt` and `knip` walk the
whole repo in one pass, so they are not repeated per package. A package still owns its _rules_ —
a nested `oxlint.config.ts` / `oxfmt.config.ts` **replaces** the root one for that package's
files rather than merging, and the root run picks it up automatically. What stays per-package is
the check that needs its own `tsconfig`: `tsc --noEmit`, plus that package's tests.

Consequence worth knowing: a package does not report lint, formatting or dead-code problems on
its own. Those surface only from the root.

## Dependencies

`oxlint`, `oxfmt` and `typescript` are pinned once in the Bun `catalog` in the root
`package.json`; packages depend on them with `"catalog:"`. Everything else is pinned exactly —
`bunfig.toml` sets `exact = true`, so `bun add` writes `1.2.3`, not `^1.2.3`. Do not hand-edit
versions to ranges.

## Conventions

Project-agnostic house rules live in `.claude/rules/` and load automatically.

The reasoning behind the non-obvious choices — why the checks live at the root, why entry points
and turbo tasks have different names, why the hooks do not auto-fix — is in
[README.md](README.md). Read it before changing the tooling setup; several entries exist
specifically to stop a plausible-looking approach from being retried.
