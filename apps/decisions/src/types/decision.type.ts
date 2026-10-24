// Request side of Ollama's decision-model endpoint (`POST /v1/systemone`).
// The response side is parsed with zod — see `@/services/ollama`.

type NoulQuestion = {
  type: "noul";
  instructions: string;
  criteria?: { true?: string; false?: string };
};

type ChoiceQuestion = {
  type: "choice";
  instructions: string;
  // Option name → description; `null` means the name describes itself.
  criteria: Record<string, string | null>;
};

type ScoreQuestion = {
  type: "score";
  instructions: string;
  // Level descriptions, lowest first; levels are numbered from 0.
  criteria: string[];
};

export type Question = NoulQuestion | ChoiceQuestion | ScoreQuestion;

// Text, or a JSON object / array the model judges as structured input.
export type DecisionState = string | Record<string, unknown> | unknown[];

export type DecisionRequest = {
  model: string;
  state: DecisionState;
  // Base64 PNG / JPEG / WebP, without a `data:` prefix.
  images?: string[];
  // Keyed by question name; answers come back under the same keys.
  questions: Record<string, Question>;
};
