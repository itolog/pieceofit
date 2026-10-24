import { describe, expect, it } from "vitest";

import { toQuestionValues } from "./to-question-values.util";

describe("toQuestionValues", () => {
  it("maps yes/no criteria onto the description fields", () => {
    expect(
      toQuestionValues("urgent", {
        type: "noul",
        instructions: "Urgent?",
        criteria: { true: "Now" },
      }),
    ).toMatchObject({
      name: "urgent",
      trueDescription: "Now",
      falseDescription: "",
    });
  });

  it("turns choice criteria into option rows, null as an empty description", () => {
    expect(
      toQuestionValues("team", {
        type: "choice",
        instructions: "Which team?",
        criteria: { billing: "Payments", technical: null },
      }).options,
    ).toEqual([
      { name: "billing", description: "Payments" },
      { name: "technical", description: "" },
    ]);
  });

  it("keeps blank rows for the inactive types", () => {
    const values = toQuestionValues("severity", {
      type: "score",
      instructions: "How bad?",
      criteria: ["Low", "High"],
    });
    expect(values.levels).toEqual([
      { description: "Low" },
      { description: "High" },
    ]);
    expect(values.options).toHaveLength(2);
  });
});
