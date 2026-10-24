import { describe, expect, it } from "vitest";

import { splitDuration } from "./split-duration.util";

describe("splitDuration", () => {
  it("keeps tenths of a second under a minute", () => {
    expect(splitDuration(3708)).toEqual({ seconds: 3, milliseconds: 700 });
    expect(splitDuration(420)).toEqual({ seconds: 0, milliseconds: 400 });
  });

  it("switches to minutes and whole seconds from a minute on", () => {
    expect(splitDuration(65_400)).toEqual({ minutes: 1, seconds: 5 });
    expect(splitDuration(120_000)).toEqual({ minutes: 2, seconds: 0 });
  });

  it("does not show 60.0 s when rounding reaches a minute", () => {
    expect(splitDuration(59_960)).toEqual({ minutes: 1, seconds: 0 });
  });

  it("clamps negative input to zero", () => {
    expect(splitDuration(-5)).toEqual({ seconds: 0, milliseconds: 0 });
  });
});
