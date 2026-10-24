import { describe, expect, it } from "vitest";

import { EMPTY_QUESTION } from "@/components/decision-form/decision-form.model";

import { toRequest } from "./to-request.util";

const base = { model: "d3", state: "Checkout is down", images: [] };

describe("toRequest", () => {
  it("sends only the active type's criteria", () => {
    const request = toRequest({
      ...base,
      questions: [
        {
          ...EMPTY_QUESTION,
          name: " urgent ",
          instructions: " Urgent? ",
          // Leftovers from another type must not leak into the request.
          options: [{ name: "stale", description: "" }],
        },
        {
          ...EMPTY_QUESTION,
          name: "team",
          type: "choice",
          instructions: "Which team?",
          options: [
            { name: "billing", description: "Payments" },
            { name: "technical", description: " " },
          ],
        },
        {
          ...EMPTY_QUESTION,
          name: "severity",
          type: "score",
          instructions: "How bad?",
          levels: [{ description: "Low" }, { description: "High" }],
        },
      ],
    });

    expect(request).toEqual({
      model: "d3",
      state: "Checkout is down",
      questions: {
        urgent: { type: "noul", instructions: "Urgent?" },
        team: {
          type: "choice",
          instructions: "Which team?",
          criteria: { billing: "Payments", technical: null },
        },
        severity: {
          type: "score",
          instructions: "How bad?",
          criteria: ["Low", "High"],
        },
      },
    });
  });

  it("keeps only the non-empty yes/no descriptions", () => {
    const request = toRequest({
      ...base,
      questions: [
        {
          ...EMPTY_QUESTION,
          name: "q",
          instructions: "?",
          trueDescription: "Now",
        },
      ],
    });
    expect(request.questions["q"]).toEqual({
      type: "noul",
      instructions: "?",
      criteria: { true: "Now" },
    });
  });

  it("parses JSON state and passes images as raw base64", () => {
    const request = toRequest({
      ...base,
      state: '{"order": 42}',
      images: [{ name: "a.png", mimeType: "image/png", data: "AA==" }],
      questions: [{ ...EMPTY_QUESTION, name: "q", instructions: "?" }],
    });
    expect(request.state).toEqual({ order: 42 });
    expect(request.images).toEqual(["AA=="]);
  });
});
