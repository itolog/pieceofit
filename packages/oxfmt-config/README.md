# `@pieceofit/oxfmt-config`

Shared [oxfmt](https://oxc.rs/docs/guide/usage/formatter) configurations,
written as TypeScript configs so consumers import them as **packages**.

| Export    | Import order                                                     |
| --------- | ---------------------------------------------------------------- |
| `./base`  | `builtin` → `external` → `internal` → relative                   |
| `./react` | `base` with `react` / `react-dom` pinned to a group of their own |

The formatting style itself is identical in both — `react` is the only thing the
react preset adds, so a Node service or a plain package has no reason to carry
it.

## Usage

Drop an `oxfmt.config.ts` next to the consumer's `package.json`:

```ts
import { defineConfig } from "oxfmt";
import react from "@pieceofit/oxfmt-config/react";

export default defineConfig({ ...react });
```

```json
{
  "devDependencies": {
    "@pieceofit/oxfmt-config": "workspace:*",
    "oxfmt": "catalog:"
  }
}
```

The package declares the dependency but no `oxfmt` script of its own: `oxfmt`
runs once from the repo root over every workspace, and picks this package's
`oxfmt.config.ts` up automatically — nested configs win for their own files.

Per-package tweaks go after the spread:

```ts
export default defineConfig({ ...react, printWidth: 120 });
```

## Composing a preset

`sortImports` is **replaced** by an outer spread, never merged into — so
`react.ts` cannot simply spread `base` and add `customGroups`. `base.ts`
therefore exports the reusable halves separately:

```ts
import base, { importGroups, sortImports } from "@pieceofit/oxfmt-config/base";

export default defineConfig({
  ...base,
  sortImports: {
    ...sortImports,
    customGroups: [{ groupName: "react", elementNamePattern: ["react"] }],
    groups: ["react", ...importGroups],
  },
});
```

## Why spread and not `extends`

oxfmt has **no `extends` key** — the official [config file
reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html)
documents 26 options and inheritance is not among them. Worse, oxfmt silently
drops unknown keys: an `"extends": [...]` in an `.oxfmtrc.json` produces no
error, not even when it points at a file that doesn't exist — it simply does
nothing, and the package quietly formats with oxfmt defaults.

A TS config sidesteps the whole problem: composition is plain object spread, so
no tool support is required. oxfmt auto-discovers `oxfmt.config.ts` (and accepts
`.json`, `.jsonc`, `.ts`, `.mts`, `.cts`, `.js`, `.mjs`, `.cjs` via `-c`).

Two dead ends, for the record: symlinking this file to a consumer's
`.oxfmtrc.json` makes oxfmt ignore it entirely (`No config found, using
defaults`), and a root-level `.oxfmtrc.json` _is_ found by an upward search but
gives every package the same style with no way to opt out.

## Why no `ignorePatterns` here

oxfmt resolves `ignorePatterns` relative to the **physical location of the config
file**, so patterns written here would be matched against
`packages/oxfmt-config/`, not the consumer's directory — silently ignoring
nothing. A consumer that needs extra excludes puts them in its own
`oxfmt.config.ts`.

Excludes otherwise come from `.gitignore`, which oxfmt honours by default —
including the repo-root one when formatting from inside a workspace package. That
already covers `node_modules`, `dist`, `build`, `out`, `.turbo`, `coverage` and
`.idea`. Note that an explicitly passed path is formatted even if ignored
(`oxfmt dist` formats `dist`). For extra excludes use `--ignore-path`, repeating
`.gitignore` explicitly since the flag replaces the defaults:

```sh
oxfmt --write --ignore-path .gitignore --ignore-path .oxfmtignore .
```
