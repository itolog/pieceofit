import { describe, expect, it } from "vitest";

import { answerHeadline } from "./answer-headline.util";

const labels = { yes: "Yes", no: "No", locale: "en" };

describe("answerHeadline", () => {
  it("states the yes/no verdict at the 0.5 threshold", () => {
    expect(answerHeadline({ type: "noul", noul: 0.5 }, labels)).toBe("Yes");
    expect(answerHeadline({ type: "noul", noul: 0.49 }, labels)).toBe("No");
  });

  it("uses the translated verdict", () => {
    expect(
      answerHeadline({ type: "noul", noul: 0.9 }, { ...labels, yes: "Так" }),
    ).toBe("Так");
  });

  it("shows the chosen option", () => {
    expect(
      answerHeadline(
        {
          type: "choice",
          choice: "technical",
          probabilities: {},
          confidence: 1,
        },
        labels,
      ),
    ).toBe("technical");
  });

  it("shows the weighted score against the top level, in the locale", () => {
    const score = {
      type: "score" as const,
      score: 2.738,
      legend: { "0": "a", "1": "b", "2": "c", "3": "d" },
      probabilities: {},
      confidence: 0.5,
    };
    expect(answerHeadline(score, labels)).toBe("2.74 / 3");
    expect(answerHeadline(score, { ...labels, locale: "uk" })).toBe("2,74 / 3");
  });
});
