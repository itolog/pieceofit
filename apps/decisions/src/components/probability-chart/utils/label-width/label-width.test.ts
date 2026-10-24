import { describe, expect, it } from "vitest";

import { labelWidth } from "./label-width.util";

const row = (label: string) => ({ label, probability: 1, picked: true });

describe("labelWidth", () => {
  it("fits the longest label within bounds", () => {
    expect(labelWidth([row("billing"), row("technical")])).toBe(9 * 7 + 12);
    expect(labelWidth([row("a")])).toBe(40);
    expect(labelWidth([row("x".repeat(100))])).toBe(160);
  });
});
