import { describe, expect, it } from "vitest";

import { presetShape } from "./preset-shape.util";

describe("presetShape", () => {
  it("keeps structure and drops text", () => {
    expect(
      presetShape({
        state: { order: 1 },
        questions: {
          team: {
            type: "choice",
            instructions: "Which team?",
            criteria: { billing: "Payments", technical: null },
          },
          severity: { type: "score", instructions: "?", criteria: ["a", "b"] },
          urgent: { type: "noul", instructions: "?" },
        },
      }),
    ).toEqual({
      state: "json",
      questions: {
        team: { type: "choice", criteria: ["billing", "technical"] },
        severity: { type: "score", criteria: 2 },
        urgent: { type: "noul", criteria: [] },
      },
    });
  });
});
