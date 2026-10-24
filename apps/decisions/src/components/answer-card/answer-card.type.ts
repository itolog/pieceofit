import { Answer } from "@/services/ollama";

export type AnswerCardProps = {
  name: string;
  answer: Answer;
  // The question text, when the request is still at hand.
  instructions?: string;
};

/** Translated words and the locale the answer utils render with. */
export type AnswerLabels = {
  yes: string;
  no: string;
  locale: string;
};
