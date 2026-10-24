import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const OLLAMA_URL = process.env["OLLAMA_URL"] ?? "http://localhost:11434";

// The page talks to Ollama through this same-origin prefix, so the browser
// never makes a cross-origin request and OLLAMA_ORIGINS needs no changes.
const ollamaProxy = {
  "/ollama": {
    target: OLLAMA_URL,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/ollama/, ""),
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { proxy: ollamaProxy },
  preview: { proxy: ollamaProxy },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
