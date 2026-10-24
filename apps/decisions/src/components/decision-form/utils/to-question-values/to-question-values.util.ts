import { match } from "ts-pattern";

import { QuestionValues } from "@/types/decision-form.type";
import { PresetQuestion } from "@/types/preset.type";

import { EMPTY_QUESTION } from "../../decision-form.model";

// One wire-format question as form fields. The other types' fields keep
// EMPTY_QUESTION's blank rows, so switching type later starts editable.
export const toQuestionValues = (
  name: string,
  question: PresetQuestion,
): QuestionValues => {
  const base = { ...EMPTY_QUESTION, name, instructions: question.instructions };
  return match(question)
    .returnType<QuestionValues>()
    .with({ type: "noul" }, ({ criteria }) => ({
      ...base,
      type: "noul",
      trueDescription: criteria?.true ?? "",
      falseDescription: criteria?.false ?? "",
    }))
    .with({ type: "choice" }, ({ criteria }) => ({
      ...base,
      type: "choice",
      options: Object.entries(criteria).map(([option, description]) => ({
        name: option,
        description: description ?? "",
      })),
    }))
    .with({ type: "score" }, ({ criteria }) => ({
      ...base,
      type: "score",
      levels: criteria.map((description) => ({ description })),
    }))
    .exhaustive();
};
