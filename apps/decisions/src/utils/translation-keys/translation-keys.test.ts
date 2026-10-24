import { describe, expect, it } from "vitest";

import { translationKeys } from "./translation-keys.util";

describe("translationKeys", () => {
  it("lists nested leaf keys as dotted paths", () => {
    expect(translationKeys({ a: { b: "x", c: { d: "y" } }, e: "z" })).toEqual([
      "a.b",
      "a.c.d",
      "e",
    ]);
  });

  it("folds plural forms into one key", () => {
    expect(
      translationKeys({ tokens_one: "1", tokens_few: "2", tokens_other: "n" }),
    ).toEqual(["tokens"]);
  });
});
