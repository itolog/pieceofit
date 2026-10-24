import { describe, expect, it } from "vitest";

import { isModelNotFound } from "./is-model-not-found.util";

describe("isModelNotFound", () => {
  it("spots Ollama's missing-model error", () => {
    expect(isModelNotFound("model 'd3' not found")).toBe(true);
    expect(isModelNotFound("The operation timed out.")).toBe(false);
  });
});
