# `@pieceofit/typescript-config`

Shared `tsconfig.json` presets. All of them are strict and add
`noUncheckedIndexedAccess` and `noFallthroughCasesInSwitch`.

| Preset         | For                        | Notable options                                                        |
| -------------- | -------------------------- | ---------------------------------------------------------------------- |
| `base.json`    | anything (no emit opinion) | `NodeNext`, `ES2022`, `isolatedModules`, `moduleDetection: force`      |
| `bun.json`     | Bun apps (incl. Ink/React) | `lib: ESNext` (no DOM), `Preserve`/`bundler`, `noEmit`, `react-jsx`    |
| `react.json`   | React apps (DOM)           | `Preserve`/`bundler`, `noEmit`, `react-jsx`, DOM libs from `base.json` |
| `library.json` | shared packages            | `declaration`, `declarationMap`                                        |

`declaration`/`declarationMap` live in `library.json`, not in `base.json`: apps
run with `noEmit`, so emitting `.d.ts` only belongs to packages that are consumed
by others.

## Usage

```json
{
  "extends": "@pieceofit/typescript-config/bun.json",
  "compilerOptions": {
    "types": ["bun"],
    "rootDir": "./src",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src/**/*"]
}
```

with `@pieceofit/typescript-config`, `typescript` (`catalog:`) and — for Bun globals —
`@types/bun` in the consumer's `devDependencies`.

Per-project settings stay in the consumer, not here: `types`, `rootDir`, `paths`,
`include`/`exclude` all depend on the layout of the package that owns them.

## Why `bun.json` drops the DOM libs

`base.json` ships `lib: ["es2022", "DOM", "DOM.Iterable"]` because React apps
need it, but nothing in a Bun process implements those globals. Inheriting them
would let `document.title`, `window.innerWidth` and `localStorage` type-check
cleanly in a CLI/TUI and then crash at runtime, so `bun.json` overrides `lib`
back down to `["ESNext"]`. A Bun program that really does target a browser
bundle can add the DOM libs in its own `tsconfig.json`.

`react.json` and `bun.json` are otherwise the same preset — the split exists for
this `lib` difference and nothing else.

## `library.json` is framework-agnostic

It carries no `jsx` setting, so it fits plain TypeScript packages as-is. A React
component library adds the one option it needs:

```json
{
  "extends": "@pieceofit/typescript-config/library.json",
  "compilerOptions": { "jsx": "react-jsx" }
}
```

The emit strategy is deliberately left out too — `outDir`, `emitDeclarationOnly`
and `rootDir` depend on how the package is built and bundled, which is the
consumer's call.

## Notes on the strictness knobs

Unused locals and parameters are reported by oxlint (`no-unused-vars` in
`@pieceofit/oxlint-config`), so `noUnusedLocals`/`noUnusedParameters` are deliberately
left off to avoid duplicate diagnostics. `noFallthroughCasesInSwitch` is the
opposite case — oxlint does **not** flag a fallthrough `case`, so TypeScript
carries that check.

`noUncheckedSideEffectImports` is not set: TypeScript 7 already errors on a
side-effect import that resolves to nothing.

## Note on `base.json` and `library.json`

Both keep `moduleResolution: NodeNext` (inherited from `base.json`), which means
extensionless relative or `paths`-mapped imports do **not** resolve — ESM under
NodeNext wants `./foo.js`. `bun.json` and `react.json` switch to `bundler`, where
extensionless imports work. An internal package that is only ever consumed
through a bundler can do the same in its own `tsconfig.json`:

```json
{
  "extends": "@pieceofit/typescript-config/library.json",
  "compilerOptions": { "module": "Preserve", "moduleResolution": "bundler" }
}
```
