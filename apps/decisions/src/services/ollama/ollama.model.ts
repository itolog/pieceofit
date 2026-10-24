// Same-origin prefix proxied to Ollama by Vite (see vite.config.ts).
export const BASE_URL = "/ollama";

// A cold model load is part of the first request, so this is generous.
export const DECIDE_TIMEOUT_MS = 120_000;
export const TAGS_TIMEOUT_MS = 5_000;
