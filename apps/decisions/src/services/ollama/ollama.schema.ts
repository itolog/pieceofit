import { z } from "zod";

// Only the fields the page reads; zod drops the rest.
export const tagsResponseSchema = z.object({
  models: z.array(
    z.object({
      name: z.string(),
      capabilities: z.array(z.string()).optional(),
    }),
  ),
});

const probabilities = z.record(z.string(), z.number());

const answerSchema = z.discriminatedUnion("type", [
  // Probability the answer is true.
  z.object({ type: z.literal("noul"), noul: z.number() }),
  z.object({
    type: z.literal("choice"),
    choice: z.string(),
    probabilities,
    // How concentrated the probabilities are — not whether it is correct.
    confidence: z.number(),
  }),
  z.object({
    type: z.literal("score"),
    // Probability-weighted level.
    score: z.number(),
    legend: z.record(z.string(), z.string()),
    probabilities,
    confidence: z.number(),
  }),
]);

export const decisionResponseSchema = z.object({
  model: z.string(),
  answers: z.record(z.string(), answerSchema),
  usage: z
    .object({ input_tokens: z.number(), output_tokens: z.number() })
    .optional(),
});

// Ollama answers errors as `{ "error": "..." }`.
export const errorResponseSchema = z.object({ error: z.string() });
