import { defineConfig } from "oxfmt";

/**
 * Import groups every project shares, in emit order. Exported on its own so a
 * preset can prepend a group (see `react.ts`) instead of restating the list —
 * oxfmt has no `extends`, so nothing merges by itself.
 */
export const importGroups = [
  "builtin",
  "external",
  "internal",
  ["parent", "sibling", "index"],
];

/**
 * The framework-agnostic half of `sortImports`. A preset that adds a custom
 * group spreads this rather than the whole config, because an outer spread
 * replaces `sortImports` wholesale instead of merging into it.
 */
export const sortImports = {
  internalPattern: ["@/", "@pieceofit/"],
  newlinesBetween: true,
  groups: importGroups,
};

// oxfmt has no `extends` of its own — consumers compose this with object
// spread in their own `oxfmt.config.ts`, which is what makes per-package
// tweaks possible without copying the whole style.
export default defineConfig({
  trailingComma: "all",
  tabWidth: 2,
  useTabs: false,
  semi: true,
  bracketSpacing: true,
  endOfLine: "lf",
  singleQuote: false,
  jsxSingleQuote: false,
  bracketSameLine: true,
  arrowParens: "always",
  printWidth: 80,
  sortPackageJson: true,
  sortImports,
});
