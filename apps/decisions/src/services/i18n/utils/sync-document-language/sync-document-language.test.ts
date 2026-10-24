import { afterEach, describe, expect, it, vi } from "vitest";

import { syncDocumentLanguage } from "./sync-document-language.util";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("syncDocumentLanguage", () => {
  it("sets the lang attribute of <html>", () => {
    const documentElement = { lang: "en" };
    vi.stubGlobal("document", { documentElement });
    syncDocumentLanguage("uk");
    expect(documentElement.lang).toBe("uk");
  });
});
