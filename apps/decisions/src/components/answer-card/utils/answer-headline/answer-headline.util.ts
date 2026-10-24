import { match } from "ts-pattern";

import { Answer } from "@/services/ollama";
import { formatDecimal } from "@/utils/format-decimal";

import { YES_THRESHOLD } from "../../answer-card.model";
import { AnswerLabels } from "../../answer-card.type";

// The one-line result shown above the bars: the verdict, the chosen option,
// or the weighted score against the top level.
export const answerHeadline = (
  answer: Answer,
  { yes, no, locale }: AnswerLabels,
): string => {
  return match(answer)
    .with({ type: "noul" }, ({ noul }) => (noul >= YES_THRESHOLD ? yes : no))
    .with({ type: "choice" }, ({ choice }) => choice)
    .with({ type: "score" }, ({ score, legend }) => {
      const topLevel = Object.keys(legend).length - 1;
      return `${formatDecimal(score, 2, locale)} / ${topLevel}`;
    })
    .exhaustive();
};
