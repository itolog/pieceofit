import { Answer } from "@/services/ollama";

export type AnswerCardProps = {
  name: string;
  answer: Answer;
  // The question text, when the request is still at hand.
  instructions?: string;
};
