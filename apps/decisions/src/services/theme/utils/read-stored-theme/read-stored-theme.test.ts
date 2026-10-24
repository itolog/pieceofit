import { afterEach, describe, expect, it, vi } from "vitest";

import { readStoredTheme } from "./read-stored-theme.util";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("readStoredTheme", () => {
  it("reads the stored value", () => {
    vi.stubGlobal("localStorage", { getItem: () => "dark" });
    expect(readStoredTheme()).toBe("dark");
  });

  it("treats unavailable storage as nothing stored", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(readStoredTheme()).toBeNull();
  });
});
