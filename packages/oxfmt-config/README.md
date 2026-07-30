# `@repo/oxfmt-config`

Shared [oxfmt](https://oxc.rs/docs/guide/usage/formatter) configuration:
formatting style plus import sorting (`react` → `builtin` → `external` →
`internal` → relative).

## Usage

oxfmt has **no `extends`**, and it only auto-discovers `.oxfmtrc.json`. To keep a
single source of truth, consumers point `-c` at this file instead of copying it:

```json
{
  "scripts": {
    "lint:format": "oxfmt --check -c ./node_modules/@repo/oxfmt-config/base.json .",
    "format": "oxfmt --write -c ./node_modules/@repo/oxfmt-config/base.json ."
  },
  "devDependencies": {
    "@repo/oxfmt-config": "*",
    "oxfmt": "catalog:"
  }
}
```

`-c ../../packages/oxfmt-config/base.json` works just as well. Editor plugins,
however, look for `.oxfmtrc.json` and know nothing about `-c` — point them at the
config path in their settings.

## Why no `ignorePatterns` here

oxfmt resolves `ignorePatterns` relative to the **physical location of the config
file**, so patterns written here would be matched against
`packages/oxfmt-config/`, not the consumer's directory — silently ignoring
nothing. (Symlinking the file into a consumer does not help: oxfmt resolves the
symlink first.)

Excludes therefore come from `.gitignore`, which oxfmt honours by default —
including the repo-root one when formatting from inside a workspace package. That
already covers `node_modules`, `dist`, `build`, `out`, `.next`, `.turbo`,
`coverage` and `.idea`. Note that an explicitly passed path is formatted even if
ignored (`oxfmt dist` formats `dist`). For extra excludes use `--ignore-path`,
repeating `.gitignore` explicitly since the flag replaces the defaults:

```sh
oxfmt --write --ignore-path .gitignore --ignore-path .oxfmtignore .
```
