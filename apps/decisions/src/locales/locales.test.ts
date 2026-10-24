import { describe, expect, it } from "vitest";

import { translationKeys } from "@/utils/translation-keys";

import en from "./en.json";
import uk from "./uk.json";

describe("locales", () => {
  it("translate the same keys as English", () => {
    expect(translationKeys(uk)).toEqual(translationKeys(en));
  });
});
