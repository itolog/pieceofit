# Module architecture

Portable convention — copy this file into any TypeScript project as-is. Anything
specific to one repository (its directory map, path alias, tool choices) belongs
in that project's `CLAUDE.md`, not here.

## Self-contained module folders

Every component / hook / utility / service is a **folder**, not a loose file:

- `index.ts` — barrel exposing the public API
- the implementation file (`*.component.tsx`, `*.hook.ts`, `*.util.ts`, `*.service.ts`)
- optional `*.type.ts` (types/interfaces only) and `*.model.ts` (constants, static data)
- co-located tests (`*.test.ts`)

Consumers import the **folder**, never the inner files:

```ts
import { InputBar } from "@/components/input-bar"; // ✅ the module's public API
import { InputBar } from "@/components/input-bar/input-bar.component"; // ❌ reaches inside
```

Within a module, its own files import each other **relatively** (`./input-bar.model`) —
a module referencing itself doesn't go through the alias. Co-located tests are the one
place that imports the implementation file directly: they test the unit, not the contract.

## Naming

Folders and files are **kebab-case**; the file's role is a suffix on the basename:

| Suffix            | Role                                     |
| ----------------- | ---------------------------------------- |
| `*.component.tsx` | UI component                             |
| `*.hook.ts`       | React hook                               |
| `*.util.ts`       | pure utility function                    |
| `*.service.ts`    | stateful service (I/O, external systems) |
| `*.type.ts`       | types / interfaces only                  |
| `*.model.ts`      | constants and static data                |
| `*.test.ts`       | tests (short form, no role suffix)       |
| `index.ts`        | public-API barrel                        |

Exported bindings keep their idiomatic casing — camelCase for functions and hooks
(`useChat`, `createMessage`), PascalCase for components and types (`Header`,
`TranslationStats`). Only _filenames_ are kebab-case.

## Types and constants aren't modules

The folder-plus-barrel rule is about units of **behaviour** — a component, hook,
utility, service. A file that holds _only_ types or _only_ constants has no
implementation to hide behind a barrel, so wrapping it in one buys nothing: it
stays a **flat file**, imported by its full path.

```ts
import { Message } from "@/types/message"; // ❌ folder + barrel around a type file
import { Message } from "@/types/message.type"; // ✅ flat, full path
```

The converse holds too: **constants live only in `*.model.ts`, types only in
`*.type.ts`** — never declared in a component, hook, service or util file, even
when private to it. A named value (a timeout, a URL prefix, a limit, a chunk size)
goes to the owning module's `*.model.ts`; a type alias, including one derived from
another type or inferred from a schema, goes to its `*.type.ts`. A util folder gets
its own `*.model.ts` / `*.type.ts` when it needs one.

```ts
// ❌ in ollama.service.ts
const DECIDE_TIMEOUT_MS = 120_000;

// ✅ ollama.model.ts, imported by the service
export const DECIDE_TIMEOUT_MS = 120_000;
```

Re-exporting a type from a barrel (`export type { … } from "./x.type"`) is the
module's public API, not a declaration, and is fine.

Most of them never leave their owning module (`*.type.ts` / `*.model.ts` next to
the implementation). One goes to a shared top-level folder for its role only once
**2+** modules need it, keeping its suffix — where that folder is, is the
project's call.

## Where a helper goes

A helper is any function that is not the file's own unit: a formatter, a mapper, a
parser, a guard, an error describer. **Helpers live only in `utils/`** — never declared
in a `*.component.tsx`, `*.hook.ts`, `*.service.ts` or `*.model.ts`, however small:

```ts
// ❌ a one-liner in a component file
const percent = (p: number) => `${(p * 100).toFixed(1)}%`;

// ✅ its own util, imported where needed
import { formatPercent } from "@/utils/format-percent";
```

- Used by **one** module → that module's own `utils/<helper>/` folder, imported relatively.
- Used by **2+** modules → the shared top-level `utils/`, imported via the project's alias.
- **One exported function per util folder.** A util does not keep private helper
  functions either: a step another util needs is a sibling util (`../to-question`).
- A util depends only on its arguments (and imports); a function that needs
  component or hook state — an event handler calling `reset()` or a field array's
  `append()` — is not a helper and stays inside the component.
- A sub-component is a component, not a helper: it gets its own module folder too,
  not a second `const Foo = () => …` in someone else's `*.component.tsx`.

Keeping single-use helpers module-local also avoids import cycles when the helper needs
the module's own types.

Sub-folders follow the same rules recursively: a helper inside `utils/` is itself a
module folder with a barrel and co-located tests.

## Keep nesting shallow

Depth is a judgement call, and the default is **shallow**. One level of `utils/` inside
a module is normal; a tree like `module/hooks/thing/utils/other-thing/` is not — it costs
readability for ownership signal that the types already carry.

When a "private" sub-module makes a folder deep, prefer promoting it to a sibling of its
consumer. Trade-off worth stating out loud: a sibling can be imported by anyone, so the
constraint that it isn't standalone-usable must then live in its options type rather than
in the directory structure.
