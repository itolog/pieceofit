import { defineConfig } from "oxfmt";

import base from "@pieceofit/oxfmt-config";

// Formatting is run once from the root over the whole repo. Packages that need
// a different style keep their own `oxfmt.config.ts` — oxfmt picks nested
// configs up automatically, so `oxfmt .` here still formats each package by its
// own rules (verified: `--disable-nested-config` turns 2 offenders into 32).
export default defineConfig({ ...base });
