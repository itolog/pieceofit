import { describe, expect, it } from "vitest";

import { LANGUAGES } from "@/models/language.model";
import { PRESETS } from "@/presets/presets.model";
import { decisionFormSchema } from "@/schemas/decision-form.schema";

import { fromPreset } from "./from-preset.util";

describe("fromPreset", () => {
  it("maps each wire question type onto form fields", () => {
    const values = fromPreset(
      {
        state: "Checkout is down",
        questions: {
          urgent: {
            type: "noul",
            instructions: "Urgent?",
            criteria: { true: "Now", false: "Later" },
          },
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
      },
      "d3",
    );

    expect(values.model).toBe("d3");
    const [urgent, team, severity] = values.questions;
    expect(urgent).toMatchObject({
      name: "urgent",
      type: "noul",
      trueDescription: "Now",
      falseDescription: "Later",
    });
    expect(team).toMatchObject({
      type: "choice",
      options: [
        { name: "billing", description: "Payments" },
        { name: "technical", description: "" },
      ],
    });
    expect(severity).toMatchObject({
      type: "score",
      levels: [{ description: "Low" }, { description: "High" }],
    });
  });

  it("shows a structured state as pretty JSON", () => {
    const values = fromPreset(
      {
        state: { a: 1 },
        questions: { q: { type: "noul", instructions: "?" } },
      },
      "d3",
    );
    expect(values.state).toBe('{\n  "a": 1\n}');
  });

  it("rejects an unknown question type", () => {
    expect(() =>
      fromPreset(
        { questions: { q: { type: "rank", instructions: "?" } } },
        "d3",
      ),
    ).toThrow();
  });

  it("turns every shipped preset, in every language, into a valid form", () => {
    for (const preset of PRESETS) {
      for (const language of LANGUAGES) {
        const result = decisionFormSchema.safeParse(
          fromPreset(preset.bodies[language], "d3"),
        );
        // The blank preset is valid only once the user fills it in.
        expect(result.success, `${preset.id}/${language}`).toBe(
          preset.id !== "blank",
        );
      }
    }
  });
});
