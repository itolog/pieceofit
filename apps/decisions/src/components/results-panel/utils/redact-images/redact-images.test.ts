import { describe, expect, it } from "vitest";

import { redactImages } from "./redact-images.util";

describe("redactImages", () => {
  it("replaces image data with its size", () => {
    const request = {
      model: "d3",
      state: "x",
      images: ["A".repeat(4096)],
      questions: {},
    };
    expect(redactImages(request).images).toEqual(["<base64, 3 KB>"]);
  });

  it("leaves a request without images untouched", () => {
    const request = { model: "d3", state: "x", questions: {} };
    expect(redactImages(request)).toBe(request);
  });
});
