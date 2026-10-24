import { z } from "zod";

// A preset is a /v1/systemone body without `model` (wire format).
export const presetSchema = z.object({
  state: z
    .union([
      z.string(),
      z.record(z.string(), z.unknown()),
      z.array(z.unknown()),
    ])
    .default(""),
  questions: z.record(
    z.string(),
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("noul"),
        instructions: z.string(),
        criteria: z
          .object({ true: z.string().optional(), false: z.string().optional() })
          .optional(),
      }),
      z.object({
        type: z.literal("choice"),
        instructions: z.string(),
        criteria: z.record(z.string(), z.string().nullable()),
      }),
      z.object({
        type: z.literal("score"),
        instructions: z.string(),
        criteria: z.array(z.string()),
      }),
    ]),
  ),
});
