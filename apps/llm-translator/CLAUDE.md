# CLAUDE.md

## Project Overview

A terminal-based translation app (TUI) built with **Ink** (React for CLI), **LangChain**, and
**Ollama**. Running it needs a local Ollama with at least one model pulled; the _preferred_
model + temperature are seeded from `src/config/model-config/`.

## Commands

The repo-wide rules — `bun` as the only runner, and `bun run verify` from the root as the
finish line before a task is done — are in [the root CLAUDE.md](../../CLAUDE.md). What is
specific here:

- `bun run test:unit` runs Vitest. The script is deliberately **not** called `test`: `bun test`
  is Bun's own runner (different runtime, incompatible APIs), and IDE runners drop the `run`
  word, so a script named `test` would silently start the wrong one.
- Only `check-types` and `test:unit` exist inside this package — good for a tight loop, but
  they are not the finish line. There is deliberately no package-level `verify`: it would pass
  while the rest of the repo is broken.

## Planning

Plans are persisted via the **`plan` skill** — it owns the format, location, and update rules.

## Conventions

Project-agnostic house rules live in `../../.claude/rules/` and load automatically. What
follows is only what is specific to this repo.

## Invariants

Break one of these and the app still compiles, but misbehaves:

- **Path alias `@/*` → `src/*`.** Cross-module imports go through the alias; a module's own
  files import each other relatively. `vitest` ignores `tsconfig`, so the alias is mirrored in
  `vitest.config.ts` — keep both in sync.
- **`llmModelService` owns the active model and temperature.** React reads them through
  `useSyncExternalStore` (in `useModel`); keep that the only copy, rather than mirroring it
  into component state.
- **One input surface is mounted at a time** — InputBar, ModelPicker and TempPicker are
  mutually exclusive, otherwise their `useInput` handlers compete for the same keys.
- **`withRetry` leaves `AbortError` alone** — user cancellation is intentional, so it must
  stay un-retried.
- In-app commands (`/from`, `/to`, `/model`, `/temp`, `/clear`, `/help`, `/exit`) are handled
  by `parseCommand()` and stop there; only plain text reaches Ollama.
- Lint, format and dead-code rules are run from the repo root. This package only wires its own
  presets in `oxlint.config.ts` / `oxfmt.config.ts`, and a nested config **replaces** the root
  one for these files rather than merging with it.

## Key Decisions

The reasoning behind the non-obvious choices, and the alternatives that were tried and
reverted: **[docs/decisions.md](docs/decisions.md)**. Open the relevant section before changing
the build, the Ink render tree, the model/temperature flow, or any tooling config — several
entries exist specifically to stop a plausible-looking approach from being retried.
