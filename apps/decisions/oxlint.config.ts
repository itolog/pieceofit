import { defineConfig } from "oxlint";

import react from "@pieceofit/oxlint-config/react";

export default defineConfig({
  extends: [react],
  // Top-level `env` is not inherited through `extends`: the page runs in the
  // browser, vite.config.ts in Node.
  env: { browser: true, node: true },
  // components/ui is shadcn's generated code, owned by its CLI (`shadcn add`
  // overwrites it), so it is not held to this repo's lint rules.
  ignorePatterns: ["dist/**", "src/components/ui/**"],
  rules: {
    // The shared preset serves Ink's classic JSX runtime; Vite uses the
    // automatic one, which needs no `React` in scope.
    "react/react-in-jsx-scope": "off",
    // Stylesheets are imported for their side effect.
    "import/no-unassigned-import": ["warn", { allow: ["**/*.css"] }],
  },
});
