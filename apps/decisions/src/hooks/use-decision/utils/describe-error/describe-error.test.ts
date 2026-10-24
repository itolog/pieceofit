import { describe, expect, it } from "vitest";

import { describeError } from "./describe-error.util";

describe("describeError", () => {
  it("adds the pull command for a missing model", () => {
    expect(describeError(new Error("model 'd3' not found"), "d3")).toBe(
      "model 'd3' not found — run: ollama pull d3",
    );
  });

  it("passes other errors through, including non-Error values", () => {
    expect(describeError(new Error("timeout"), "d3")).toBe("timeout");
    expect(describeError("boom", "d3")).toBe("boom");
  });
});
