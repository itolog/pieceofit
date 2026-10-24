import { QuestionType } from "@/types/decision-form.type";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  noul: "Yes / no",
  choice: "Choice",
  score: "Score",
};

export const QUESTION_TYPE_HINTS: Record<QuestionType, string> = {
  noul: "Returns the probability that the answer is true.",
  choice: "Picks one option and returns the probability of each.",
  score: "Rates on your scale and returns a probability-weighted level.",
};
