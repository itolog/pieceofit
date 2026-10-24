import { afterEach, describe, expect, it, vi } from "vitest";

import { THEME_STORAGE_KEY } from "../../theme.model";
import { writeStoredTheme } from "./write-stored-theme.util";

const stubStorage = () => {
  const storage = { setItem: vi.fn(), removeItem: vi.fn() };
  vi.stubGlobal("localStorage", storage);
  return storage;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("writeStoredTheme", () => {
  it("stores an explicit choice", () => {
    const storage = stubStorage();
    writeStoredTheme("dark");
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, "dark");
  });

  it("clears the key for system", () => {
    const storage = stubStorage();
    writeStoredTheme("system");
    expect(storage.removeItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it("ignores unavailable storage", () => {
    vi.stubGlobal("localStorage", {
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    expect(() => writeStoredTheme("light")).not.toThrow();
  });
});
