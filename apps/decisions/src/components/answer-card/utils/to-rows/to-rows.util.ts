import { match } from "ts-pattern";

import { Answer } from "@/services/ollama";
import { AnswerRow } from "@/types/answer-row.type";

import { argmax } from "../argmax";

// Every answer type as the same list of bars, with the model's pick marked:
// the threshold for yes/no, the chosen option, the most likely score level.
export const toRows = (answer: Answer): AnswerRow[] => {
  return match(answer)
    .returnType<AnswerRow[]>()
    .with({ type: "noul" }, ({ noul }) => [
      { label: "Yes", probability: noul, picked: noul >= 0.5 },
      { label: "No", probability: 1 - noul, picked: noul < 0.5 },
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
