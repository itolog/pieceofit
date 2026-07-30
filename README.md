# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `llm-translator`: a terminal translation app ([Ink](https://term.ink/) + LangChain + Ollama) run by [Bun](https://bun.sh/)
- `@repo/typescript-config`: `tsconfig.json` presets (`base`, `bun`, `react`, `library`)
- `@repo/oxlint-config`: shared [oxlint](https://oxc.rs/) configs (`base`, `react`)
- `@repo/oxfmt-config`: shared [oxfmt](https://oxc.rs/) formatting + import-sorting config

Tooling lives in the packages that use it, not at the root: each app/package
declares `oxlint`, `oxfmt`, `typescript` (all `catalog:`) plus the shared config
packages it needs, and exposes `lint` / `format` / `check-types` scripts. The root
only holds `turbo`, which orchestrates them.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Shared dependency versions

`oxlint`, `oxfmt`, `typescript` and `concurrently` are pinned once in the
[Bun catalog](https://bun.com/docs/pm/catalogs) under `workspaces.catalog` in the
root `package.json`. Packages depend on them with the catalog protocol, so a
version bump happens in one place:

```json
{
  "devDependencies": {
    "oxlint": "catalog:"
  }
}
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for code linting
- [oxfmt](https://oxc.rs/docs/guide/usage/formatter) for code formatting and import sorting

### Lint & format

From the root, every task fans out through turbo:

```sh
bun run lint          # turbo run lint
bun run fix:lint      # turbo run fix:lint
bun run format        # turbo run format
bun run check-types   # turbo run check-types
```

An app or package wires itself up like this — `lint` runs its own `lint:*` scripts
in parallel via `concurrently`:

```json
{
  "scripts": {
    "lint": "conc --timings -c \"auto\" \"bun:lint:*\"",
    "lint:code": "oxlint",
    "lint:format": "oxfmt --check -c ./node_modules/@repo/oxfmt-config/base.json .",
    "lint:types": "tsc --noEmit",
    "fix:lint": "oxlint --fix",
    "format": "oxfmt --write -c ./node_modules/@repo/oxfmt-config/base.json ."
  },
  "devDependencies": {
    "@repo/oxfmt-config": "*",
    "@repo/oxlint-config": "*",
    "@repo/typescript-config": "*",
    "concurrently": "catalog:",
    "oxfmt": "catalog:",
    "oxlint": "catalog:",
    "typescript": "catalog:"
  }
}
```

plus its own `.oxlintrc.json`:

```json
{
  "extends": ["../../packages/oxlint-config/react.json"],
  "env": { "browser": true, "node": true },
  "ignorePatterns": ["**/dist/**"]
}
```

See the config packages' READMEs for the details (`extends` does not inherit
`env`/`ignorePatterns`; oxfmt has no `extends` at all, hence the `-c` flag).

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
bun dlx turbo build
bun exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=llm-translator
```

Without global `turbo`:

```sh
npx turbo build --filter=llm-translator
bun exec turbo build --filter=llm-translator
bun exec turbo build --filter=llm-translator
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
bun exec turbo dev
bun exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=llm-translator
```

Without global `turbo`:

```sh
npx turbo dev --filter=llm-translator
bun exec turbo dev --filter=llm-translator
bun exec turbo dev --filter=llm-translator
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
bun exec turbo login
bun exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
bun exec turbo link
bun exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
