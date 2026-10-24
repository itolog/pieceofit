import { describe, expect, it } from "vitest";

import { parseLanguage } from "./parse-language.util";

describe("parseLanguage", () => {
  it("keeps a supported language, region subtags included", () => {
    expect(parseLanguage("uk")).toBe("uk");
    expect(parseLanguage("uk-UA")).toBe("uk");
    expect(parseLanguage("EN-gb")).toBe("en");
  });

  it("falls back to English for anything else", () => {
    expect(parseLanguage("de")).toBe("en");
    expect(parseLanguage(undefined)).toBe("en");
  });
});
