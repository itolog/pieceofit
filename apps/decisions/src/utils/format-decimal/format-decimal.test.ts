import { describe, expect, it } from "vitest";

import { formatDecimal } from "./format-decimal.util";

describe("formatDecimal", () => {
  it("rounds to the given decimals in the locale's notation", () => {
    expect(formatDecimal(2.738, 2)).toBe("2.74");
    expect(formatDecimal(2.738, 2, "uk")).toBe("2,74");
    expect(formatDecimal(0.5, 2)).toBe("0.50");
  });
});
