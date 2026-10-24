import { describe, expect, it } from "vitest";

import { answerHeadline } from "./answer-headline.util";

describe("answerHeadline", () => {
  it("states the yes/no verdict at the 0.5 threshold", () => {
    expect(answerHeadline({ type: "noul", noul: 0.5 })).toBe("Yes");
    expect(answerHeadline({ type: "noul", noul: 0.49 })).toBe("No");
  });

  it("shows the chosen option", () => {
    expect(
      answerHeadline({
        type: "choice",
        choice: "technical",
        probabilities: {},
        confidence: 1,
      }),
    ).toBe("technical");
  });

  it("shows the weighted score against the top level", () => {
    expect(
      answerHeadline({
        type: "score",
        score: 2.738,
        legend: { "0": "a", "1": "b", "2": "c", "3": "d" },
        probabilities: {},
        confidence: 0.5,
      }),
    ).toBe("2.74 / 3");
  });
});
