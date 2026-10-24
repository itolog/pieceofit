import { describe, expect, it } from "vitest";

import { toRows } from "./to-rows.util";

describe("toRows", () => {
  it("splits a yes/no answer into two bars", () => {
    expect(toRows({ type: "noul", noul: 0.2 })).toEqual([
      { label: "Yes", probability: 0.2, picked: false },
      { label: "No", probability: 0.8, picked: true },
    ]);
  });

  it("marks the chosen option", () => {
    const rows = toRows({
      type: "choice",
      choice: "b",
      probabilities: { a: 0.1, b: 0.9 },
      confidence: 0.8,
    });
    expect(rows.map((row) => row.picked)).toEqual([false, true]);
  });

  it("labels score levels with the legend and marks the most likely", () => {
    const rows = toRows({
      type: "score",
      score: 1.7,
      legend: { "0": "Low", "1": "Mid", "2": "High" },
      probabilities: { "0": 0.1, "1": 0.1, "2": 0.8 },
      confidence: 0.6,
    });
    expect(rows.map((row) => [row.label, row.picked])).toEqual([
      ["0 · Low", false],
      ["1 · Mid", false],
      ["2 · High", true],
    ]);
  });
});
