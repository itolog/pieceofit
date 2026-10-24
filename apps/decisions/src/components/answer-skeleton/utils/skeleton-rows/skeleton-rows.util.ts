import { match } from "ts-pattern";

import { Question } from "@/types/decision.type";

// How many bars the answer will have: one meter for yes/no, one per option
// or level otherwise — so the placeholder matches what replaces it.
export const skeletonRows = (question: Question): number => {
  return match(question)
    .with({ type: "noul" }, () => 1)
    .with({ type: "choice" }, ({ criteria }) => Object.keys(criteria).length)
    .with({ type: "score" }, ({ criteria }) => criteria.length)
    .exhaustive();
};
