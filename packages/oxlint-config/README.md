# `@repo/oxlint-config`

Shared [oxlint](https://oxc.rs/docs/guide/usage/linter) configurations.

| Config       | Adds                                                        |
| ------------ | ----------------------------------------------------------- |
| `base.json`  | `typescript`, `unicorn`, `oxc`, `import`, `import/no-cycle` |
| `react.json` | `base` + `react`, `react-perf`, `jsx-a11y`, `react-hooks/*` |

## Usage

Add the package plus `oxlint` itself to the consuming app or package, and drop an
`.oxlintrc.json` next to its `package.json`:

```json
{
  "scripts": {
    "lint:code": "oxlint",
    "fix:lint": "oxlint --fix"
  },
  "devDependencies": {
    "@repo/oxlint-config": "*",
    "oxlint": "catalog:"
  }
}
```

```json
{
  "extends": ["../../packages/oxlint-config/react.json"],
  "env": { "browser": true, "node": true },
  "ignorePatterns": ["**/dist/**"]
}
```

`extends` takes **file paths**, not package specifiers. The relative path above
works; so does the workspace symlink Bun creates inside the consumer
(`./node_modules/@repo/oxlint-config/react.json`).

oxlint also discovers nested `.oxlintrc.json` files automatically, so a config in
a subdirectory applies to the files below it.

## What `extends` does and does not merge

`plugins`, `categories` and `rules` are merged along the `extends` chain (later
configs win). `plugins` is _overwritten_, not appended, so every config here
lists the full plugin set it wants.

`env`, `globals` and `ignorePatterns` are **not** inherited — only the values in
the config file oxlint actually loads take effect. Keep those in the consuming
`.oxlintrc.json`, not here, otherwise they silently do nothing. `.gitignore` is
honoured on top of `ignorePatterns`.
