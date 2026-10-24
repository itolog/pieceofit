import { describe, expect, it } from "vitest";

import { bounceIndex } from "./bounce-index.util";

describe("bounceIndex", () => {
  it("runs to the end and back without repeating the ends", () => {
    const path = Array.from({ length: 9 }, (_, tick) => bounceIndex(tick, 4));
    expect(path).toEqual([0, 1, 2, 3, 2, 1, 0, 1, 2]);
  });

  it("stays put with a single slot", () => {
    expect(bounceIndex(7, 1)).toBe(0);
  });
});
