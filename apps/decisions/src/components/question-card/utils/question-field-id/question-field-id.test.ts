import { describe, expect, it } from "vitest";

import { questionFieldId } from "./question-field-id.util";

describe("questionFieldId", () => {
  it("is unique per question and field", () => {
    expect(questionFieldId(2, "name")).toBe("questions-2-name");
  });
});
