import { describe, expect, it } from "vitest";

import { parseState } from "./parse-state.util";

describe("parseState", () => {
  it("keeps plain text as a string", () => {
    expect(parseState("checkout is down")).toBe("checkout is down");
  });

  it("sends JSON objects and arrays as structured state", () => {
    expect(parseState(' {"a": 1} ')).toEqual({ a: 1 });
    expect(parseState("[1, 2]")).toEqual([1, 2]);
  });

  it("falls back to text when the JSON is invalid", () => {
    expect(parseState("{not json")).toBe("{not json");
  });
});
