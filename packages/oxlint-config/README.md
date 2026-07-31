# `@pieceofit/oxlint-config`

Shared [oxlint](https://oxc.rs/docs/guide/usage/linter) configurations, written
as TypeScript configs so consumers can import them as **packages** rather than
as file paths.

| Export    | Adds                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `./base`  | plugins `typescript`, `unicorn`, `oxc`, `import`; `correctness: error` + `suspicious: warn`; `import/no-cycle`; `es2026` |
| `./react` | `base` + plugins `react`, `react-perf`, `jsx-a11y`; `react-hooks/*`                                                      |

## Usage

Add the package plus `oxlint` itself to the consuming app, and drop an
`oxlint.config.ts` next to its `package.json`:

```ts
import { defineConfig } from "oxlint";
import react from "@pieceofit/oxlint-config/react";

export default defineConfig({
  extends: [react],
  env: { node: true },
  ignorePatterns: ["dist/**"],
});
```

```json
{
  "scripts": {
    "lint:code": "oxlint",
    "fix:lint": "oxlint --fix"
  },
  "devDependencies": {
    "@pieceofit/oxlint-config": "*",
    "oxlint": "catalog:"
  }
}
```

## Why TypeScript and not `.oxlintrc.json`

`extends` in the JSON format takes **file paths only** — package specifiers are
rejected outright ("Oxlint does not support ESLint shared configs"), which is why
the JSON version of this setup had to reach into
`./node_modules/@pieceofit/oxlint-config/…`. The TS format takes imported config
_objects_, so the shared config travels as a normal dependency. oxlint
auto-discovers `oxlint.config.ts` and `oxlint.config.mts`.

A side benefit: because the dependency is now a real import, knip sees it, so it
no longer needs an `ignoreDependencies` entry.

## What `extends` does and does not carry

`plugins`, `categories`, `rules` and `overrides` all **merge** along the chain
(later entries win on conflicts). `plugins` merges too, so `react.ts` lists only
what it adds and still yields the full set:

```
import, jsx-a11y, oxc, react, react-perf, typescript, unicorn
```

A **top-level `env` is not inherited** — not even in a TS config, where
everything else does merge. Only the config oxlint actually loads is read for it.
Inside an `overrides` entry it _does_ carry across, which is how `base.ts` shares
the `es2026` language level. Runtime globals (`node`, `browser`) deliberately
stay in the consumer, since they differ per app. `.gitignore` is honoured on top
of `ignorePatterns`.

## On `suspicious`

`correctness` is the "this is a bug" tier and is an error. `suspicious` is the
"this is probably wrong" tier and is a warning — oxlint exits non-zero only on
errors unless you pass `--deny-warnings`, so it flags without blocking. Keep the
count at zero anyway; a permanently warning build teaches people to ignore
warnings.
