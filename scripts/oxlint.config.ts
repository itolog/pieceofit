import { defineConfig } from "oxlint";

import base from "@pieceofit/oxlint-config";

// A nested config REPLACES the root one for this directory rather than merging
// with it, so the shared base is restated here — the only thing added is the
// architectural boundary below.
export default defineConfig({
  extends: [base],
  // Config files and scripts are Bun code; `env` is not inherited through
  // `extends`, so it is restated (see the base preset's comment).
  env: { node: true },
  overrides: [
    {
      // The menu's domain must stay drawable by any UI: `core/` describes what
      // the menu *is*, a view decides how it looks. Enforced rather than
      // documented, because one convenient import is all it takes to weld the
      // two together and make swapping the view a rewrite.
      files: ["task-menu/core/**/*.ts"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: ["**/ui/**"],
          },
        ],
      },
    },
  ],
});
