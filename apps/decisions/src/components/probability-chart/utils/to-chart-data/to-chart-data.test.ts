import { describe, expect, it } from "vitest";

import { toChartData } from "./to-chart-data.util";

describe("toChartData", () => {
  it("reverses rows so Nivo draws them top-down, picked as 0/1", () => {
    expect(
      toChartData([
        { label: "billing", probability: 0.1, picked: false },
        { label: "technical", probability: 0.9, picked: true },
      ]),
    ).toEqual([
      { label: "technical", probability: 0.9, picked: 1 },
      { label: "billing", probability: 0.1, picked: 0 },
    ]);
  });
});
