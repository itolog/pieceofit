# LLM Translator TUI 🚀

A terminal-based chat translator built with **Ink** (React for CLI), **LangChain**, and **Ollama**.

## 🛠 Prerequisites

- [**Bun**](https://bun.sh/) — the runtime and package manager (used to run, build, and manage packages).
- **Ollama** installed and running on your machine.
- A model pulled in Ollama (e.g., `gemma3:4b`).

## 📦 Installation

This app lives in the `pieceofit` monorepo at `apps/llm-translator`.

1. Install dependencies from the repo root:

   ```bash
   bun install
   ```

2. Configure the preferred model. Edit the defaults in
   `src/config/model-config/default-model-config.ts`:

   ```ts
   export const defaultModelConfig: ModelConfig = {
     MODEL: "gemma4:12b-mlx",
     LLM_TEMP: 0.1,
   };
   ```

   This is only a **preferred** default — it does not have to be installed. On
   startup the app falls back to an installed model if this one is missing (or
   prompts you to pull one if none are). You can also switch at runtime with
   `/model` and `/temp`.

   The Ollama endpoint and timeouts live in
   `src/config/app-config/app-config.ts` (`OLLAMA_BASE_URL`, `LLM_TIMEOUT_MS`,
   `MODEL_CHECK_TIMEOUT_MS`, `MAX_MESSAGES`). Unlike the model and temperature,
   these are **not** runtime-mutable and are not read from the environment —
   `OLLAMA_BASE_URL` is hard-coded to `http://localhost:11434`, so pointing at
   another Ollama host means editing that file.

## 🚀 Usage

Start the TUI:

```bash
bun start
```

On startup the app checks Ollama for installed models: if the preferred `MODEL`
is available it uses it; otherwise it falls back to the first installed model
(telling you), or — if none are installed — prints how to pull one.

### TUI Commands

Type into the input field. Anything not starting with `/` is translated.

- `/from <lang>` — Change the source language (e.g., `/from english`).
- `/to <lang>` — Change the target language (e.g., `/to polish`).
- `/model [name]` — Switch the model. Omit the name to pick from a list.
- `/temp [0-2]` — Set the temperature. Omit the value to adjust with a stepper.
- `/clear` — Clear the message history.
- `/help` — List available commands.
- `/exit` (`/quit`, `/q`) — Close the app.

## 🛠 Development

- **Conventions**: `../../.claude/rules/` — `module-architecture.md` (module folders,
  naming, helper placement) and `code-comments.md` (comment style). Project
  specifics (layout, key decisions) are in `CLAUDE.md` and
  [`docs/decisions.md`](docs/decisions.md).

What runs **from this directory**:

- **Watch mode**: `bun run dev`
- **Tests**: `bun run test:unit` (Vitest). Add a pattern to narrow it —
  `bun run test:unit use-chat` — or use `test:unit-watch` / `test:unit-coverage`
  (coverage fails below the thresholds in `vitest.config.ts`).
  The script avoids the name `test` so it can never collide with Bun's own
  `bun test` runner, which IDE runners would otherwise start instead.
- **Types**: `bun run check-types` (`tsc --noEmit`)
- **Build a standalone binary**: `bun run build` → `dist/llm-translator`

What runs **only from the repo root**, because [Oxc](https://oxc.rs/) (`oxlint`, `oxfmt`)
and [knip](https://knip.dev/) walk the whole repo in one pass:

- **Lint + format**: `bun run check` (`bun run fix` for the autofixable half)
- **Dead code**: `bun run check-unused`
- **Full verification**: `bun run verify` — lint, format, types, tests and dead code.
  This is the finish line, and there is deliberately no package-level equivalent: it
  would pass while the rest of the repo is broken.

This package still owns its lint/format _rules_ (`oxlint.config.ts`, `oxfmt.config.ts`);
a nested config **replaces** the root one for these files rather than merging with it.
