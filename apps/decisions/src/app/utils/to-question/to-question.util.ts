import { match } from "ts-pattern";

import { QuestionValues } from "@/types/decision-form.type";
import { Question } from "@/types/decision.type";

// One form question in wire format, with only its active type's criteria.
export const toQuestion = (question: QuestionValues): Question => {
  const instructions = question.instructions.trim();
  return match(question)
    .returnType<Question>()
    .with({ type: "noul" }, ({ trueDescription, falseDescription }) => {
      // Empty descriptions are left out rather than sent as "".
      const criteria = {
        ...(trueDescription.trim() && { true: trueDescription.trim() }),
        ...(falseDescription.trim() && { false: falseDescription.trim() }),
      };
      return Object.keys(criteria).length > 0
        ? { type: "noul", instructions, criteria }
        : { type: "noul", instructions };
    })
    .with({ type: "choice" }, ({ options }) => ({
      type: "choice",
      instructions,
      // An empty description becomes `null`: the option name describes itself.
      criteria: Object.fromEntries(
        options.map((option) => [
          option.name.trim(),
          option.description.trim() || null,
        ]),
      ),
    }))
    .with({ type: "score" }, ({ levels }) => ({
      type: "score",
      instructions,
      criteria: levels.map((level) => level.description.trim()),
    }))
    .exhaustive();
};
