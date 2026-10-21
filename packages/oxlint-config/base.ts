import { defineConfig } from "oxlint";

export default defineConfig({
  // `plugins`, `categories` and `rules` all merge along `extends`, so a config
  // built on this one lists only what it adds.
  plugins: ["typescript", "unicorn", "oxc", "import"],
  categories: {
    correctness: "error",
    // Warnings don't fail the build (that needs `--deny-warnings`), so this is
    // a nudge, not a gate.
    suspicious: "warn",
  },
  rules: {
    // Circular-dependency detection; reads tsconfig for the `@/*` alias, so no
    // separate madge/dpdm is needed.
    "import/no-cycle": "error",
    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
  },
  // ! A top-level `env` is NOT inherited through `extends` — not even in a TS
  // config, where everything else merges. Inside `overrides` it does carry
  // across, which is the one way to share it from here. Runtime globals
  // (`node`, `browser`) stay in the consumer: they differ per app.
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      env: { es2026: true },
    },
  ],
});
