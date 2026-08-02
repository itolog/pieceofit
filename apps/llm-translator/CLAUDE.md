# CLAUDE.md

## Project Overview

A terminal-based translation app (TUI) built with **Ink** (React for CLI), **LangChain**, and
**Ollama**. Running it needs a local Ollama with at least one model pulled; the _preferred_
model + temperature are seeded from `src/config/model-config/`.

## Commands

**`bun` is the only package manager and script runner here — never invoke `npm`, `npx`, `yarn`,
or `pnpm`.** Use `bun run <script>` for scripts and `bunx <tool>` for one-off binaries. `bun run`
with no argument lists every script — that list is the source of truth, not this file.

- `bun run test:unit` runs Vitest. The script is deliberately **not** called `test`: `bun test`
  is Bun's own built-in runner (different runtime, incompatible APIs — no `vi.hoisted`, no
  `vitest.config.ts`), and IDE runners drop the `run` word, so a script named `test` would
  silently start the wrong runner.
- **`verify` lives at the repo root, not here** — `bun run verify` from the root is lint +
  format + types + tests + dead code in one pass (~1 s). Always run it before considering a
  task done, and fix what it reports before moving on. There is deliberately no local `verify`:
  linting, formatting and dead-code detection are repo-wide now, so a package-level one would
  pass while the repo is broken.
- Inside this package only `check-types` and `test:unit` exist — useful for a tight loop, but
  they are not the finish line.

## Planning

Plans are persisted via the **`plan` skill** — it owns the format, location, and update rules;
don't restate them here.

## Conventions

Project-agnostic house rules live in `../../.claude/rules/` and load automatically — don't
restate them here. The rest of this file is what's specific to this repo.

## Key Decisions

Non-obvious choices and their _why_ — the reasoning you can't recover from the code.

### Runtime & build

- **`bun`** runs the app (`bun src/index.tsx`) and is the package manager; `bunfig.toml` sets
  `[run] bun = true`, so even tools with a `node` shebang execute on Bun.
- `bun run build` produces a **standalone binary** (`dist/llm-translator`) via `bun build --compile
--minify`.
- **`react-devtools-core` is a local no-op stub** (`stubs/react-devtools-core/`, wired in as a
  `file:` dependency). Ink's `devtools.js` has a top-level static import of it, and `--compile`
  bundles that file regardless of the `DEV` guard around it, so the name must resolve — the stub
  keeps the real ~3 MB package out of the binary. Rejected alternatives, don't retry them:
  `--external react-devtools-core` builds fine but the binary dies on startup with `Cannot find
package`; `--define`/`--env` don't help because Bun resolves the dynamic `import('./devtools.js')`
  whether or not the guard is statically false. A `tsconfig` `paths` alias works too, but only
  from a **root** `tsconfig.json` — Bun matches `paths` against ink's realpath under the workspace
  root `node_modules/.bun/`, not against the app — so the `file:` dependency is preferred: it
  needs no config outside this package.
- JSX target is `"react"` (classic runtime), not `"react-jsx"` — Ink uses React but not the
  new JSX transform.

### Module resolution & imports

- `tsconfig`: `moduleResolution: "bundler"` + `module: "Preserve"` (`noEmit`), so local imports
  omit `.js` extensions and resolve `index` by folder. `bun` runs/builds (does the resolution);
  `tsc` is type-check only.
- **Path alias `@/*` → `src/*`.** Cross-module imports use the alias; intra-module imports stay
  relative (a module referencing its own files doesn't go through the alias). `bun`/`tsc` read
  the alias from `tsconfig`; `vitest` does **not**, so it's mirrored in `vitest.config.ts`
  `resolve.alias`.

### LLM service

- The translation chain (`prompt.pipe(llm)`) is built once in the `LlmModelService` constructor,
  not per request. The service is a singleton `llmModelService` and owns request orchestration
  (timeout, abort, retry, text cleaning); `useChat` only owns the per-submit `AbortController`.
- **The service is the single source of truth for the active model + temperature** (seeded from
  `defaultModelConfig`; `setModel`/`setTemperature` rebuild the chain). React reads them via
  `subscribe` + `getModel`/`getTemperature` through `useSyncExternalStore` (in `useModel`) — there
  is no duplicate copy in component state.
- `AbortController` is per-submit; the timeout also calls `controller.abort()` to close the HTTP
  connection to Ollama. `withRetry` does **not** retry `AbortError` — user cancellation is
  intentional.
- **Startup model resolution** — the configured `MODEL` is a _preferred_ default, not a hard
  requirement. On mount `useChat` calls `resolveStartupModel()` (`/api/tags`): `"ok"` if
  installed; `"no-models"` → posts a "pull one first" notice and blocks translation; `"fallback"`
  → switches to the first installed model and tells the user (so the app works on any machine).
  `verifyModel()` still warns after a manual `/model <name>` switch.

### UI / commands

- In-app commands (`/from`, `/to`, `/model`, `/temp`, `/clear`, `/help`, `/exit`) are parsed by
  `parseCommand()` and never sent to Ollama. **Bare `/model`** and **bare `/temp`** open pickers
  (`ModelPicker` / `TempPicker`) in place of the `InputBar`; `/model <name>` and `/temp <value>`
  apply directly. Only one of InputBar / ModelPicker / TempPicker is mounted at a time so their
  `useInput` handlers don't compete for keys.
- The header banner is a **pre-rendered constant** (`header.model.ts`), not `ink-big-text`. That
  package renders through `cfonts`, which loads fonts via a computed `require()` no bundler can
  follow — so `--compile` produced a binary whose header was just an error message. The `why` and
  the regeneration command live next to the constant.
- Chat messages render as **cards** (built-in Ink `<Box borderStyle="round">`, per-role
  `borderColor`) with a header row (role + `HH:MM`) _inside_ the card — not an in-border title.
  `@mishieck/ink-titled-box` was tried for the in-border title and reverted: it positions the
  title via `measureElement` + `useEffect`, which mis-renders full-width cards in a wide
  terminal (missing top-left corner / left border). Don't reach for it again.

### Tooling

Rules and presets are shared from `packages/*` at the repo root; only the per-app wiring
lives here, in `oxlint.config.ts` and `oxfmt.config.ts`. Both are **TypeScript** because
that is the only config format that can import a shared config as a package rather than as
a path into `node_modules` — and it means `tsc` type-checks them (they are in the
`include`, which is why this package has no `rootDir`).

- **Lint:** [oxlint](https://oxc.rs/) — `oxlint.config.ts` does `extends: [react]` with the
  preset imported from `@pieceofit/oxlint-config/react`. It declares only `env` (runtime
  globals) and `ignorePatterns`: a top-level `env` is **not** inherited through `extends`,
  even in a TS config, so it has to be restated per app. `import/no-cycle` comes from the
  shared base and auto-reads `tsconfig` for the `@/*` alias — no madge/dpdm needed.
  Note that a nested config **replaces** the repo-root one rather than merging with it, so
  what is written here (plus what it `extends`) is exactly what applies — including when
  oxlint is invoked from the repo root.
- **Format:** [oxfmt](https://oxc.rs/) — `oxfmt.config.ts` spreads
  `@pieceofit/oxfmt-config/react` (the `react` import group is the only thing that preset
  adds over `./base`). oxfmt has no `extends` at all, and silently ignores the key if you
  write one, so object spread is the composition mechanism — and `sortImports` is replaced
  by a spread rather than merged, which is why the preset re-spreads the shared half.
- **Dead code:** [knip](https://knip.dev/) — lives at the **repo root** (`knip.json` there
  carries this app's settings under `workspaces`), run as `bun run check-unused`. It has to
  run from the root: started inside this package it cannot see the root `catalog`, and
  reports every `catalog:` dependency as an unresolved reference. Kept **out of pre-commit**
  — it resolves the whole module graph, so it can't run on staged files only.
- **Git hooks:** none. Upstream used Lefthook, but hooks install from the repo root, so if we
  want them they belong there, not in this package.
