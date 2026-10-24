import { describe, expect, it } from "vitest";

import { parsePreference } from "./parse-preference.util";

describe("parsePreference", () => {
  it("keeps an explicit choice", () => {
    expect(parsePreference("dark")).toBe("dark");
    expect(parsePreference("light")).toBe("light");
  });

  it("falls back to system for missing or unknown values", () => {
    expect(parsePreference(null)).toBe("system");
    expect(parsePreference("sepia")).toBe("system");
  });
});
