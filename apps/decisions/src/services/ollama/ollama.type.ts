import { z } from "zod";

import { decisionResponseSchema } from "./ollama.schema";

export type DecisionResponse = z.infer<typeof decisionResponseSchema>;

export type Answer = DecisionResponse["answers"][string];

export type DecisionModel = {
  name: string;
  // Accepts `images` alongside the state.
  vision: boolean;
};

export type DecideResult = {
  response: DecisionResponse;
  elapsedMs: number;
};
