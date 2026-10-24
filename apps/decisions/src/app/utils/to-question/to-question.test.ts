import { describe, expect, it } from "vitest";

import { EMPTY_QUESTION } from "@/components/decision-form/decision-form.model";

import { toQuestion } from "./to-question.util";

describe("toQuestion", () => {
  it("drops empty yes/no descriptions", () => {
    expect(
      toQuestion({ ...EMPTY_QUESTION, instructions: " Urgent? " }),
    ).toEqual({ type: "noul", instructions: "Urgent?" });
  });

  it("sends an empty option description as null", () => {
    expect(
      toQuestion({
        ...EMPTY_QUESTION,
        type: "choice",
        instructions: "Which team?",
        options: [
          { name: " billing ", description: "Payments" },
          { name: "technical", description: " " },
        ],
      }),
    ).toEqual({
      type: "choice",
      instructions: "Which team?",
      criteria: { billing: "Payments", technical: null },
    });
  });

  it("sends score levels in order", () => {
    expect(
      toQuestion({
        ...EMPTY_QUESTION,
        type: "score",
        instructions: "How bad?",
        levels: [{ description: "Low" }, { description: "High" }],
      }).criteria,
    ).toEqual(["Low", "High"]);
  });
});
