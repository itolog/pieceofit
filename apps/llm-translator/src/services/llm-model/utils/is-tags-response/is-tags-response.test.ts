import { describe, expect, it } from "vitest";

import { isTagsResponse } from "./is-tags-response.util";

describe("isTagsResponse", () => {
  it("accepts a listing of { name, model } tags", () => {
    expect(
      isTagsResponse({ models: [{ name: "llama3", model: "llama3" }] }),
    ).toBe(true);
  });

  it("accepts an empty listing and a missing `models` key", () => {
    expect(isTagsResponse({ models: [] })).toBe(true);
    expect(isTagsResponse({})).toBe(true);
  });

  it("rejects a non-object body", () => {
    expect(isTagsResponse(null)).toBe(false);
    expect(isTagsResponse("models")).toBe(false);
    expect(isTagsResponse([])).toBe(false);
  });

  it("rejects `models` that is not an array of well-formed tags", () => {
    expect(isTagsResponse({ models: "llama3" })).toBe(false);
    expect(isTagsResponse({ models: [{ name: "llama3" }] })).toBe(false);
    expect(isTagsResponse({ models: [{ name: 1, model: "llama3" }] })).toBe(
      false,
    );
  });
});
