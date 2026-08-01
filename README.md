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
- `@pieceofit/typescript-config`: `tsconfig.json` presets (`base`, `bun`, `react`, `library`)
- `@pieceofit/oxlint-config`: shared [oxlint](https://oxc.rs/) configs (`base`, `react`)
- `@pieceofit/oxfmt-config`: shared [oxfmt](https://oxc.rs/) formatting + import-sorting config

Tooling is split by responsibility: the root runs everything that works across the
whole repo in one pass — `oxlint`, `oxfmt`, `knip` — while each app/package keeps
its own config files (which override the root's for its files) and the one check
that needs its own `tsconfig`: `tsc`. See [Lint & format](#lint--format).

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Shared dependency versions

`oxlint`, `oxfmt` and `typescript` are pinned once in the
[Bun catalog](https://bun.com/docs/pm/catalogs) — the top-level `catalog` field of
the root `package.json`. Packages depend on them with the catalog protocol, so a
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

Checks live on two levels, split by who can do the work.

**The root owns oxc.** `oxlint` and `oxfmt` walk the entire repo in one pass —
apps, packages and the loose files at the root alike — so they are not repeated
per package:

```sh
bun run check   # turbo run quality      → oxlint . + oxfmt --check .
bun run fix     # turbo run quality:fix  → oxlint --fix . then oxfmt --write .
```

The `fix` order is deliberate: `//#fix:format` `dependsOn` `//#fix:lint`, so the
two never write the same file at once. Note that `quality` and `quality:fix` are
turbo tasks only — a script may not invoke a Root Task of the same name, which is
why the entry points are called `check` and `fix`.

`knip` lives at the root for the same reason, but stays out of `quality`: it
resolves the whole module graph, which is too slow for a pre-commit hook. It also
_has_ to run from the root — started inside a package it cannot see the root
`catalog`, and reports every `catalog:` dependency as an unresolved reference:

```sh
bun run check-unused   # knip across every workspace
```

**Each package owns its rules, and whatever the root cannot do.** A nested
`oxlint.config.ts` / `oxfmt.config.ts` _replaces_ the root one for that package's
files, and the root run picks it up automatically — so centralising the run does
not centralise the rules. What stays in a package is the one check that needs its
own `tsconfig`:

```json
{
  "scripts": {
    "check-types": "tsc --noEmit"
  }
}
```

```sh
bun run check-types   # turbo run check-types → tsc in every package
```

So the root is where checks are run from, named by what they cover rather than by
which tool runs them:

| Command                | What it covers                         |
| ---------------------- | -------------------------------------- |
| `bun run verify`       | **everything below** — the finish line |
| `bun run check`        | oxlint + oxfmt, whole repo             |
| `bun run fix`          | the autofixable half of `check`        |
| `bun run check-types`  | `tsc` in every package                 |
| `bun run check-unused` | knip, whole repo                       |

`verify` is one `turbo run` over all four, so everything is cached and parallel:
~2 s cold, single-digit milliseconds when nothing changed. Run it before calling
a task done.

The trade-off worth knowing: a package no longer reports lint, formatting or
dead-code problems on its own — those surface only from the root. That is also
why there is no package-level `verify`: it would pass while the repo is broken.

A package still declares its own `oxlint`/`oxfmt` plus the shared config packages,
because that is what its `oxlint.config.ts` and `oxfmt.config.ts` import:

```ts
import { defineConfig } from "oxlint";
import react from "@pieceofit/oxlint-config/react";

export default defineConfig({
  extends: [react],
  // Runtime globals are per-app; the language level comes from the shared base.
  env: { node: true },
  ignorePatterns: ["dist/**"],
});
```

```ts
import { defineConfig } from "oxfmt";
import base from "@pieceofit/oxfmt-config";

export default defineConfig({ ...base });
```

Both are TypeScript on purpose: it is the only format that can import a shared
config as a **package** instead of a path into `node_modules`. See the config
packages' READMEs for the details (oxlint's `extends` carries `plugins`,
`categories`, `rules` and `overrides` but not a top-level `env`; oxfmt has no
`extends` at all, so it composes by object spread).

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
