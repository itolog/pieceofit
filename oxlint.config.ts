import { defineConfig } from "oxlint";

import base from "@pieceofit/oxlint-config";

// The root config is what applies to everything that has no config of its own:
// the shared `packages/*` and any loose file at the repo root. An app with its
// own `oxlint.config.ts` REPLACES this one for its files (nested configs do not
// merge), which is the point — the root owns the run, each package owns its
// rules.
export default defineConfig({
  extends: [base],
  // Config files and shared presets are Node/Bun code; nothing here is browser
  // code. Apps restate their own globals, since `env` is not inherited.
  env: { node: true },
  ignorePatterns: ["**/dist/**"],
  // ! Root-only: oxlint ignores `typeAware` in nested configs, so it can't move
  // into the shared base.
  options: { typeAware: true },
});
