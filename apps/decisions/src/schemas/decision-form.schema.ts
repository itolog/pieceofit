import { z } from "zod";

import {
  MAX_OPTIONS,
  MAX_QUESTIONS,
  MIN_OPTIONS,
  QUESTION_TYPES,
} from "@/models/decision.model";

// The form keeps every type's fields on each question, so switching the type
// does not throw away what was typed. Only the active type's fields are
// validated (superRefine) and sent (see `toRequest`).
const questionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Required")
      .regex(/^[\w-]+$/, "Letters, digits, _ and - only"),
    type: z.enum(QUESTION_TYPES),
    instructions: z.string().trim().min(1, "Required"),
    trueDescription: z.string(),
    falseDescription: z.string(),
    options: z.array(z.object({ name: z.string(), description: z.string() })),
    levels: z.array(z.object({ description: z.string() })),
  })
  .superRefine((question, ctx) => {
    const rows =
      question.type === "choice"
        ? question.options.map((option) => option.name)
        : question.type === "score"
          ? question.levels.map((level) => level.description)
          : null;
    if (rows === null) return;

    const listPath = question.type === "choice" ? "options" : "levels";
    const field = question.type === "choice" ? "name" : "description";
    if (rows.length < MIN_OPTIONS || rows.length > MAX_OPTIONS) {
      ctx.addIssue({
        code: "custom",
        path: [listPath],
        message: `Needs ${MIN_OPTIONS}–${MAX_OPTIONS} ${listPath}`,
      });
    }
    const seen = new Set<string>();
    rows.forEach((value, index) => {
      const key = value.trim();
      if (key === "") {
        ctx.addIssue({
          code: "custom",
          path: [listPath, index, field],
          message: "Required",
        });
      } else if (question.type === "choice" && seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: [listPath, index, field],
          message: "Duplicate option",
        });
      }
      seen.add(key);
    });
  });

export const decisionFormSchema = z
  .object({
    model: z.string().min(1, "Pick a decision model"),
    state: z.string(),
    images: z.array(
      z.object({ name: z.string(), mimeType: z.string(), data: z.string() }),
    ),
    questions: z
      .array(questionSchema)
      .min(1, "Add at least one question")
      .max(MAX_QUESTIONS, `At most ${MAX_QUESTIONS} questions`),
  })
  .superRefine((form, ctx) => {
    if (form.state.trim() === "" && form.images.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["state"],
        message: "Describe the state or attach an image",
      });
    }
    // Question names become the keys of a JSON object, so they must be unique.
    const seen = new Set<string>();
    form.questions.forEach((question, index) => {
      const name = question.name.trim();
      if (name !== "" && seen.has(name)) {
        ctx.addIssue({
          code: "custom",
          path: ["questions", index, "name"],
          message: "Name already used",
        });
      }
      seen.add(name);
    });
  });
