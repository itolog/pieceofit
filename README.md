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

Everything else is pinned exactly — no `^`, no drift. That is not a convention you
have to remember: the root `bunfig.toml` sets `exact = true`, so `bun add` writes
`1.2.3` rather than `^1.2.3`. The same file pins the registry explicitly and sets
`[run] bun = true`, which puts every `node`-shebang tool (`vitest`, `turbo`,
`oxlint`, `knip`, `tsc`) on the Bun runtime — the same runtime the app ships on.

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for code linting
- [oxfmt](https://oxc.rs/docs/guide/usage/formatter) for code formatting and import sorting
- [knip](https://knip.dev/) for dead code and unused dependencies
- [lefthook](https://lefthook.dev/) for git hooks — see [Git hooks](#git-hooks)

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
answers a different question (dead code, not style) and costs an order of
magnitude more, so it keeps its own entry point and its own turbo task. It also
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

### Git hooks

[Lefthook](https://lefthook.dev/) runs the same checks, scoped to what you are
actually committing or pushing. It is configured once at the root — hooks install
into the one `.git`, so a per-package config would have nowhere to go.

| Hook         | Jobs (parallel)                                  | Scope                                     |
| ------------ | ------------------------------------------------ | ----------------------------------------- |
| `pre-commit` | `lint & format` · `check-types` · `check-unused` | staged files · whole package · whole repo |
| `pre-push`   | `audit` · `test:unit`                            | whole repo                                |

Both hooks run their jobs in parallel. Inside `lint & format` the two steps stay
sequential — `oxlint --fix` and `oxfmt --write` write to the same files, so
running _those_ concurrently would be a write race.

`lint & format` is cheap because it only sees `{staged_files}` — and passing
explicit paths does **not** flatten the rules: oxc still resolves the nearest
`oxlint.config.ts` / `oxfmt.config.ts`, so a file in `apps/llm-translator` is
judged by that app's react preset. Fixes are re-staged automatically
(`stage_fixed: true`); anything oxlint cannot fix on its own fails the commit.

`check-types` and `check-unused` cannot be scoped that way — types and dead code
are properties of the whole graph, not of one file. Both are affordable anyway
because turbo caches them: an untouched repo costs milliseconds, and editing an
app file does invalidate the root `//#check-unused` task, so the cache never hides
a real finding. They run on commit rather than on push so the mistake surfaces
while the change is still in your head.

Note what `check-unused` implies: a file you add but do not import yet is dead
code, and the commit will say so. Wire it up, or commit with `LEFTHOOK=0`.

`pre-push` keeps what genuinely belongs to "about to leave this machine":
the test suite and a dependency audit.

Hooks are installed by the root `prepare` script, so they re-sync on every
`bun install` — no manual setup after cloning. To bypass them once:

```sh
LEFTHOOK=0 git commit -m "…"   # skip lefthook, keep other hooks
git commit --no-verify         # skip all git hooks
```

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
