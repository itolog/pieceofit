import { describe, expect, it } from "vitest";

import { resolveTheme } from "./resolve-theme.util";

describe("resolveTheme", () => {
  it("follows the OS only for the system preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});
