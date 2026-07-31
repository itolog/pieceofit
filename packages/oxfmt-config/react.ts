import { defineConfig } from "oxfmt";

import base, { importGroups, sortImports } from "@pieceofit/oxfmt-config/base";

// Pinning `react` above `builtin` is the only thing this preset does — the rest
// of the style is framework-agnostic and stays in `base`.
export default defineConfig({
  ...base,
  // ! `sortImports` is REPLACED by the outer spread, never merged — the shared
  // half has to be spread back in here explicitly.
  sortImports: {
    ...sortImports,
    customGroups: [
      {
        groupName: "react",
        elementNamePattern: ["react", "react-dom", "react-dom/*"],
      },
    ],
    groups: ["react", ...importGroups],
  },
});
