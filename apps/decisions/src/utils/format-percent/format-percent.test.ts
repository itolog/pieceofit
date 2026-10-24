import { describe, expect, it } from "vitest";

import { formatPercent } from "./format-percent.util";

describe("formatPercent", () => {
  it("formats a probability with one decimal", () => {
    expect(formatPercent(0.98684)).toBe("98.7%");
    expect(formatPercent(0)).toBe("0.0%");
    expect(formatPercent(1)).toBe("100.0%");
  });

  it("uses the locale's decimal separator", () => {
    expect(formatPercent(0.98684, "uk")).toBe("98,7%");
  });
});
