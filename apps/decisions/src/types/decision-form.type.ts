import { z } from "zod";

import { decisionFormSchema } from "@/schemas/decision-form.schema";

export type DecisionFormValues = z.infer<typeof decisionFormSchema>;

export type QuestionValues = DecisionFormValues["questions"][number];

export type QuestionType = QuestionValues["type"];

/** A picked image: raw base64 plus what the preview needs. */
export type ImageValue = DecisionFormValues["images"][number];
