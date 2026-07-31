import { defineConfig } from "oxlint";

import base from "@pieceofit/oxlint-config/base";

export default defineConfig({
  extends: [base],
  plugins: ["react", "react-perf", "jsx-a11y"],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
  },
});
