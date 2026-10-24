import { QuestionType } from "@/types/question-type.type";

// Each question type's identity colour (tokens in index.css), as literal
// class names so Tailwind can find them. Never the only cue: it always comes
// with the type's name (TypeBadge).
export const QUESTION_TYPE_STYLES: Record<
  QuestionType,
  { dot: string; edge: string }
> = {
  noul: { dot: "bg-type-noul", edge: "border-l-type-noul" },
  choice: { dot: "bg-type-choice", edge: "border-l-type-choice" },
  score: { dot: "bg-type-score", edge: "border-l-type-score" },
};
