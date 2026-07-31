import { defineConfig } from "oxfmt";

import react from "@pieceofit/oxfmt-config/react";

// oxfmt has no `extends`; spreading the shared preset is the composition
// mechanism. Per-package tweaks go after the spread.
export default defineConfig({ ...react });
