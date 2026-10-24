import { defineConfig } from "oxfmt";

import react from "@pieceofit/oxfmt-config/react";

// oxfmt has no `extends`; the shared preset composes by spread.
export default defineConfig({ ...react });
