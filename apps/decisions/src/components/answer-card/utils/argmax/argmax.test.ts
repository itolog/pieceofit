import { describe, expect, it } from "vitest";

import { argmax } from "./argmax.util";

describe("argmax", () => {
  it("returns the most likely key", () => {
    expect(argmax({ "0": 0.1, "1": 0.7, "2": 0.2 })).toBe("1");
  });

  it("keeps the first key on a tie and handles an empty map", () => {
    expect(argmax({ a: 0.5, b: 0.5 })).toBe("a");
    expect(argmax({})).toBeUndefined();
  });
});
