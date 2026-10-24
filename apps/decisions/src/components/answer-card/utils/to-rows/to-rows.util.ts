import { match } from "ts-pattern";

import { Answer } from "@/services/ollama";
import { AnswerRow } from "@/types/answer-row.type";

import { YES_THRESHOLD } from "../../answer-card.model";
import { AnswerLabels } from "../../answer-card.type";
import { argmax } from "../argmax";

// Every answer type as the same list of bars, with the model's pick marked:
// the threshold for yes/no, the chosen option, the most likely score level.
export const toRows = (
  answer: Answer,
  { yes, no }: Pick<AnswerLabels, "yes" | "no">,
): AnswerRow[] => {
  return match(answer)
    .returnType<AnswerRow[]>()
    .with({ type: "noul" }, ({ noul }) => [
      { label: yes, probability: noul, picked: noul >= YES_THRESHOLD },
      { label: no, probability: 1 - noul, picked: noul < YES_THRESHOLD },
    ])
    .with({ type: "choice" }, ({ choice, probabilities }) =>
      Object.entries(probabilities).map(([label, probability]) => ({
        label,
        probability,
        picked: label === choice,
      })),
    )
    .with({ type: "score" }, ({ legend, probabilities }) => {
      const top = argmax(probabilities);
      return Object.entries(probabilities).map(([level, probability]) => ({
        label: `${level} · ${legend[level] ?? ""}`,
        probability,
        picked: level === top,
      }));
    })
    .exhaustive();
};
