import { describe, expect, it } from "vitest";

import { formatStats } from "./format-stats.util";

const response = { model: "d3", answers: {} };

describe("formatStats", () => {
  it("hides output tokens when the model reports none", () => {
    expect(
      formatStats({
        elapsedMs: 859.4,
        response: {
          ...response,
          usage: { input_tokens: 215, output_tokens: 0 },
        },
      }),
    ).toBe("859 ms · 215 tokens");
  });

  it("shows both counts when the model generated tokens", () => {
    expect(
      formatStats({
        elapsedMs: 10,
        response: {
          ...response,
          usage: { input_tokens: 486, output_tokens: 3 },
        },
      }),
    ).toBe("10 ms · 486 in / 3 out tokens");
  });

  it("shows only the time without usage", () => {
    expect(formatStats({ elapsedMs: 5, response })).toBe("5 ms");
  });
});
