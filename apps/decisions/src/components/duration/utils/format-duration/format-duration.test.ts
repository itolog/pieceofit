import { describe, expect, it } from "vitest";

import { formatDuration } from "./format-duration.util";

// Exact wording comes from the engine's ICU data and differs between
// engines ("1 хв і 5 с" in Chrome, "1 хв, 5 с" in Bun), so these check the
// numbers and separators, not whole strings.
describe("formatDuration", () => {
  it("shows seconds with one decimal in the locale's notation", () => {
    expect(formatDuration(3708, "en")).toContain("3.7");
    expect(formatDuration(3708, "uk")).toContain("3,7");
  });

  it("still shows a zero duration", () => {
    expect(formatDuration(0, "en")).toContain("0.0");
  });

  it("uses whole minutes and seconds from a minute on", () => {
    const text = formatDuration(65_400, "en");
    expect(text).toMatch(/\b1\b/);
    expect(text).toMatch(/\b5\b/);
    expect(text).not.toMatch(/5\.0/);
  });
});
