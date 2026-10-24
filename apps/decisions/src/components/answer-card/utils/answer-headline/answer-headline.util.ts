import { match } from "ts-pattern";

import { Answer } from "@/services/ollama";

// The one-line result shown above the bars: the verdict, the chosen option,
// or the weighted score against the top level.
export const answerHeadline = (answer: Answer): string => {
  return match(answer)
    .with({ type: "noul" }, ({ noul }) => (noul >= 0.5 ? "Yes" : "No"))
    .with({ type: "choice" }, ({ choice }) => choice)
    .with({ type: "score" }, ({ score, legend }) => {
      const topLevel = Object.keys(legend).length - 1;
      return `${score.toFixed(2)} / ${topLevel}`;
    })
    .exhaustive();
};
