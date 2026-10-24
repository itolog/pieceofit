import { describe, expect, it } from "vitest";

import { EMPTY_QUESTION } from "@/components/decision-form/decision-form.model";
import { DecisionFormValues } from "@/types/decision-form.type";

import { decisionFormSchema } from "./decision-form.schema";

const valid: DecisionFormValues = {
  model: "d3",
  state: "Checkout is down",
  images: [],
  questions: [{ ...EMPTY_QUESTION, name: "urgent", instructions: "Urgent?" }],
};

const issuePaths = (values: DecisionFormValues) => {
  const result = decisionFormSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((i) => i.path.join("."));
};

describe("decisionFormSchema", () => {
  it("accepts a minimal yes/no question", () => {
    expect(issuePaths(valid)).toEqual([]);
  });

  it("ignores blank choice rows while the question is yes/no", () => {
    // EMPTY_QUESTION carries two blank options; they only count for choice.
    expect(issuePaths(valid)).toEqual([]);
  });

  it("requires a state or an image", () => {
    expect(issuePaths({ ...valid, state: " " })).toEqual(["state"]);
    expect(
      issuePaths({
        ...valid,
        state: "",
        images: [{ name: "a.png", mimeType: "image/png", data: "AA==" }],
      }),
    ).toEqual([]);
  });

  it("rejects duplicate question keys", () => {
    expect(
      issuePaths({
        ...valid,
        questions: [valid.questions[0]!, valid.questions[0]!],
      }),
    ).toEqual(["questions.1.name"]);
  });

  it("validates choice options: blank and duplicate names", () => {
    const question = {
      ...EMPTY_QUESTION,
      name: "team",
      instructions: "Which team?",
      type: "choice" as const,
      options: [
        { name: "billing", description: "" },
        { name: "billing", description: "" },
        { name: " ", description: "" },
      ],
    };
    expect(issuePaths({ ...valid, questions: [question] })).toEqual([
      "questions.0.options.1.name",
      "questions.0.options.2.name",
    ]);
  });

  it("needs at least two score levels", () => {
    const question = {
      ...EMPTY_QUESTION,
      name: "severity",
      instructions: "How bad?",
      type: "score" as const,
      levels: [{ description: "Low" }],
    };
    expect(issuePaths({ ...valid, questions: [question] })).toEqual([
      "questions.0.levels",
    ]);
  });

  it("restricts keys to letters, digits, _ and -", () => {
    const question = { ...valid.questions[0]!, name: "needs tools" };
    expect(issuePaths({ ...valid, questions: [question] })).toEqual([
      "questions.0.name",
    ]);
  });
});
