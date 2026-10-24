import { DecisionFormValues } from "@/types/decision-form.type";
import { DecisionRequest } from "@/types/decision.type";
import { parseState } from "@/utils/parse-state";

import { toQuestion } from "../to-question";

// Builds the /v1/systemone body from validated form values, sending only the
// active type's fields for each question.
export const toRequest = (values: DecisionFormValues): DecisionRequest => ({
  model: values.model,
  state: parseState(values.state),
  ...(values.images.length > 0 && {
    images: values.images.map((image) => image.data),
  }),
  questions: Object.fromEntries(
    values.questions.map((question) => [
      question.name.trim(),
      toQuestion(question),
    ]),
  ),
});
