# pieceofit

A Bun + Turborepo monorepo.

- `llm-translator` — a terminal translation app ([Ink](https://term.ink/) + LangChain +
  [Ollama](https://ollama.com/)) run by [Bun](https://bun.sh/)

`bun` is the only runner. `bun run` with no argument lists every script; `bun run verify` at
the root is the finish line — lint, format, types, tests and dead code in one turbo graph.

## Reinstalling dependencies

`deps:reinstall` wipes `node_modules` — the root one **and** the one every workspace keeps of
its own — then installs from `bun.lock`. This is the one to reach for when module resolution
misbehaves: the dependency tree comes back exactly as locked.

`deps:reset` deletes `bun.lock` on top of that, so the tree is resolved from scratch. Direct
dependencies stay put (`exact = true` pins them), but transitive ones drift to whatever
satisfies their ranges today. Only two situations call for it: a structurally broken lockfile
(bad merge, hand edit), or a registry change — resolved URLs are baked into `bun.lock` and no
reinstall rewrites them. Running it out of habit is how a routine `node_modules` fix quietly
reshuffles the tree.
