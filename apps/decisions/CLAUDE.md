# CLAUDE.md

A Vite + React page for Ollama decision models (`POST /v1/systemone`). What it does and
how to run it: [README.md](README.md). Repo-wide rules (bun only, `bun run verify` from
the root as the finish line) are in [the root CLAUDE.md](../../CLAUDE.md).

## Invariants

- **The browser only talks to `/ollama`.** Vite proxies it to `OLLAMA_URL` in both `dev`
  and `preview` (`vite.config.ts`), so there is no CORS setup. Do not point `fetch` at
  `localhost:11434` directly.
- **`src/components/ui/` and `src/lib/` belong to the shadcn CLI.** `shadcn add`
  writes and overwrites them, so they are excluded from oxlint and knip and do not follow
  the folder-per-module rule. Do not edit them by hand; wrap or compose instead.
- **The form keeps every question type's fields on each question.** Switching the type
  hides fields instead of deleting them; `decisionFormSchema` validates only the active
  type's fields (superRefine) and `toRequest` sends only those. A new type-specific field
  needs all three: the schema, its superRefine branch, and `toRequest`.
- **Wire responses are parsed with zod** (`services/ollama/ollama.schema.ts`), never
  cast. Request types are plain TS in `types/decision.type.ts`, because the page builds
  them itself.
- **`themeService` owns the theme** (preference in `localStorage`, the OS fallback, the
  `.dark` class). React reads it through `useTheme` (`useSyncExternalStore`). The inline
  script in `index.html` applies the stored theme before the bundle loads and repeats its
  storage key and logic — change both together.
- **Chart colours come from `CHART_PALETTE`** (`probability-chart.model.ts`), keyed by
  the resolved theme, not from CSS variables: Nivo writes SVG `fill` attributes, where
  `var()` does not resolve. The accent was validated for contrast against both card
  surfaces; re-check it if the shadcn theme's card colour changes.
- **Colour carries meaning, never alone.** The blue accent (`--primary`) marks actions
  and the model's pick; each question type has an identity colour (`--type-*` in
  `index.css`, mapped in `QUESTION_TYPE_STYLES`) that always comes with its name
  (`TypeBadge`) or a visible type select. The set was checked with the dataviz palette
  validator, all pairs, in both themes — re-run it before adding or changing a colour.
- **Every UI string goes through i18next** (`src/locales/{en,uk}.json`). `t()` is typed
  against `en.json` (`types/i18next.type.ts`, a module augmentation nothing imports, so
  knip ignores it), and a unit test holds `uk.json` to the same keys. Validation messages
  in the zod schema are keys from `FORM_ERRORS`, translated by `FormFieldError`; numbers
  go through `formatPercent` / `formatDecimal` with `i18n.language`; durations through
  `Duration` (`Intl.DurationFormat`: units come from the engine, so tests check numbers, not
  wording, which differs between Chrome and Bun).
- **Models are filtered by the `decision` capability** from `/api/tags`; `vision`
  enables image upload. Do not hard-code model names.

## Conventions

On top of `../../.claude/rules/`: zod schemas live in `*.schema.ts` files, which are
constants and so stay flat like `*.model.ts`; the types inferred from them go to a
`*.type.ts` (`types/decision-form.type.ts`), like every other type. Constants shared by
2+ modules live in `src/models/`, next to `src/types/`. This package uses the automatic JSX
runtime (`react-jsx`), unlike the Ink app, so its `oxlint.config.ts` turns off
`react/react-in-jsx-scope`.
