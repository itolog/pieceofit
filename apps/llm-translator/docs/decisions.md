# Key decisions

Non-obvious choices and their _why_ — the reasoning you can't recover from the code, plus the
alternatives that were tried and reverted, so nobody retries them. Referenced from
[`../CLAUDE.md`](../CLAUDE.md); read the section that covers what you are about to change.

## Runtime & build

- **`bun`** runs the app (`bun src/index.tsx`) and is the package manager; the **root**
  `bunfig.toml` sets `[run] bun = true`, so even tools with a `node` shebang execute on Bun —
  `vitest`, `turbo`, `oxlint`, `knip` and `tsc` all run on the Bun runtime, which is also
  what the app itself runs on. Verified: inside the repo `bun run node -e …` reports
  `process.versions.bun`, outside it reports Node.
- `bun run build` produces a **standalone binary** (`dist/llm-translator`) via
  `bun build --compile --minify`.
- **`react-devtools-core` is a local no-op stub** (`stubs/react-devtools-core/`, wired in as a
  `file:` dependency). Ink's `devtools.js` has a top-level static import of it, and `--compile`
  bundles that file regardless of the `DEV` guard around it, so the name must resolve — the stub
  keeps the real ~3 MB package out of the binary. Rejected alternatives, don't retry them:
  `--external react-devtools-core` builds fine but the binary dies on startup with
  `Cannot find package`; `--define`/`--env` don't help because Bun resolves the dynamic
  `import('./devtools.js')` whether or not the guard is statically false. A `tsconfig` `paths`
  alias works too, but only from a **root** `tsconfig.json` — Bun matches `paths` against ink's
  realpath under the workspace root `node_modules/.bun/`, not against the app — so the `file:`
  dependency is preferred: it needs no config outside this package.
- JSX target is `"react"` (classic runtime), not `"react-jsx"` — Ink uses React but not the
  new JSX transform.

## Module resolution & imports

- `tsconfig`: `moduleResolution: "bundler"` + `module: "Preserve"` (`noEmit`), so local imports
  omit `.js` extensions and resolve `index` by folder. `bun` runs/builds (does the resolution);
  `tsc` is type-check only.
- **Path alias `@/*` → `src/*`.** Cross-module imports use the alias; intra-module imports stay
  relative (a module referencing its own files doesn't go through the alias). `bun`/`tsc` read
  the alias from `tsconfig`; `vitest` does **not**, so it's mirrored in `vitest.config.ts`
  `resolve.alias`.

## LLM service

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

## UI / commands

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

## Tooling

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
  The one exception is **type-aware linting**: `options.typeAware` is read from the root
  config only (oxlint ignores it in nested ones), and it is a switch for the whole run, so
  it lives in the root `oxlint.config.ts` and covers this app too. The `typescript/*`
  type-aware rules themselves (`no-floating-promises`, `no-misused-promises`) are ordinary
  rules in the shared base. They run through `oxlint-tsgolint`, a separate binary that
  oxlint spawns — so it is a root devDependency, next to the oxlint that launches it, not
  a dependency of the preset package. Coverage is wider than this app's `include`: the
  shared presets are part of its program through their imports, and files outside every
  tsconfig (the root `oxlint.config.ts` / `oxfmt.config.ts`) still get type information —
  `no-floating-promises` fires there too.
  **A broken `tsconfig.json` hides every type-aware finding** for its program: oxlint
  reports only `Invalid tsconfig`, without naming the cause. Run `tsc --noEmit` in the
  package to see which option is wrong. The run still fails, so nothing slips through,
  but the other findings only appear once the tsconfig is fixed.
- **Type check:** `tsc --noEmit`, per package, as the `check-types` turbo task. oxlint's
  `options.typeCheck` / `--type-check` (which adds TypeScript's own errors to the lint run)
  was evaluated against it with oxlint 1.89 and `oxlint-tsgolint` 7.0.2004, and **not
  adopted**. On the whole program it reports the same errors as `tsc` — same TypeScript
  7.0.2 underneath — but:
  - it reports type errors only for the files being linted, and pre-commit lints staged
    files only, so a caller broken by a signature change in another file would get
    through; `tsc` checks the whole program;
  - a broken `tsconfig.json` comes out as a bare `Invalid tsconfig` (see above), where
    `tsc` names the offending option;
  - it moves type checking from the per-package, separately cached `check-types` into the
    root lint task, which reruns on any change anywhere in the repo;
  - the flag is marked experimental.

  The gain does not pay for that: about 150 ms less CPU per run, no change to `verify`
  wall time (its tasks run in parallel), and type checking of the two root config files,
  which no tsconfig covers. Revisit once the flag is no longer experimental and reports
  tsconfig errors properly.

- **Format:** [oxfmt](https://oxc.rs/) — `oxfmt.config.ts` spreads
  `@pieceofit/oxfmt-config/react` (the `react` import group is the only thing that preset
  adds over `./base`). oxfmt has no `extends` at all, and silently ignores the key if you
  write one, so object spread is the composition mechanism — and `sortImports` is replaced
  by a spread rather than merged, which is why the preset re-spreads the shared half.
- **Dead code:** [knip](https://knip.dev/) — lives at the **repo root** (`knip.json` there
  carries this app's settings under `workspaces`), run as `bun run check-unused`. It has to
  run from the root: started inside this package it cannot see the root `catalog`, and
  reports every `catalog:` dependency as an unresolved reference. It **is** in pre-commit,
  but as its own turbo task rather than scoped to staged files — it resolves the whole
  module graph, so it either sees everything or nothing; the turbo cache is what makes
  that affordable (~0.06 s warm, ~0.7 s cold).
- **Git hooks:** [Lefthook](https://lefthook.dev/), configured at the **repo root**
  (`lefthook.yml`) — hooks install into the single `.git`, so they cannot live in a package.
  Both hooks run their jobs in parallel. `pre-commit`: `lint & format` over staged files
  only (nested configs still apply, so this app's react preset is what judges its files;
  the two steps are sequential inside the job — same file, no write race) plus `check-types`
  and `check-unused`, which cannot be scoped to staged files (turbo caches both, so an
  untouched repo costs milliseconds). `pre-push`: `audit` + `test:unit`. Hooks re-sync on
  every `bun install` via the root `prepare` script. Escape hatches: `LEFTHOOK=0 git commit …`
  skips them entirely, `git commit --no-verify` is the git-level equivalent.
