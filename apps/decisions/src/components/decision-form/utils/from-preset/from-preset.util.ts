import { presetSchema } from "@/schemas/preset.schema";
import { DecisionFormValues } from "@/types/decision-form.type";

import { toQuestionValues } from "../to-question-values";

// Turns a preset body into form values. A structured state is shown as
// pretty JSON; parseState turns it back into an object on submit.
export const fromPreset = (
  body: unknown,
  model: string,
): DecisionFormValues => {
  const preset = presetSchema.parse(body);
  return {
    model,
    state:
      typeof preset.state === "string"
        ? preset.state
        : JSON.stringify(preset.state, null, 2),
    images: [],
    questions: Object.entries(preset.questions).map(([name, question]) =>
      toQuestionValues(name, question),
    ),
  };
};
