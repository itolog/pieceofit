import { defineConfig } from "oxlint";

import react from "@pieceofit/oxlint-config/react";

export default defineConfig({
  // A TS config is what makes this a package import rather than a path into
  // node_modules — `.oxlintrc.json` cannot resolve package specifiers.
  extends: [react],
  // Runtime globals only; the language level (es2026) comes from the shared
  // base. No `browser`: this is a Bun TUI, and its tsconfig drops the DOM libs
  // for the same reason.
  env: { node: true },
  ignorePatterns: ["dist/**"],
});
