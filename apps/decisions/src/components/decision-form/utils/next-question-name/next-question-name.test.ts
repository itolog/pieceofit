import { describe, expect, it } from "vitest";

import { nextQuestionName } from "./next-question-name.util";

describe("nextQuestionName", () => {
  it("numbers after the existing questions", () => {
    expect(nextQuestionName(["urgent", "team"])).toBe("question_3");
  });

  it("skips keys that are already taken", () => {
    expect(nextQuestionName(["question_2", "question_3"])).toBe("question_4");
  });
});
