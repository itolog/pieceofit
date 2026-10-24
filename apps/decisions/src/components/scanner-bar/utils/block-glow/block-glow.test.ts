import { describe, expect, it } from "vitest";

import { SCANNER_GLOW_FLOOR, SCANNER_TRAIL } from "../../scanner-bar.model";
import { blockGlow } from "./block-glow.util";

describe("blockGlow", () => {
  it("is brightest at the head", () => {
    expect(blockGlow(5, 5)).toBe(1);
  });

  it("fades over the trail on both sides", () => {
    const half = SCANNER_GLOW_FLOOR + (1 - SCANNER_GLOW_FLOOR) * 0.5;
    expect(blockGlow(5 + SCANNER_TRAIL / 2, 5)).toBeCloseTo(half);
    expect(blockGlow(5 - SCANNER_TRAIL / 2, 5)).toBeCloseTo(half);
  });

  it("settles on the floor past the trail", () => {
    expect(blockGlow(5 + SCANNER_TRAIL + 3, 5)).toBe(SCANNER_GLOW_FLOOR);
  });
});
