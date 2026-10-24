import { describe, expect, it } from "vitest";

import { skeletonRows } from "./skeleton-rows.util";

describe("skeletonRows", () => {
  it("matches the bars the answer will have", () => {
    expect(skeletonRows({ type: "noul", instructions: "?" })).toBe(1);
    expect(
      skeletonRows({
        type: "choice",
        instructions: "?",
        criteria: { a: null, b: null, c: null },
      }),
    ).toBe(3);
    expect(
      skeletonRows({ type: "score", instructions: "?", criteria: ["x", "y"] }),
    ).toBe(2);
  });
});
