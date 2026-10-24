import { presetSchema } from "@/schemas/preset.schema";

import { PresetShape } from "./preset-shape.type";

// A preset with every translatable string stripped: what kind of state it
// has, and per question its type plus option names or level count. Two
// translations of a preset must have the same shape.
export const presetShape = (body: unknown): PresetShape => {
  const preset = presetSchema.parse(body);
  return {
    state: typeof preset.state === "string" ? "text" : "json",
    questions: Object.fromEntries(
      Object.entries(preset.questions).map(([key, question]) => [
        key,
        {
          type: question.type,
          criteria:
            question.type === "choice"
              ? Object.keys(question.criteria)
              : question.type === "score"
                ? question.criteria.length
                : Object.keys(question.criteria ?? {}),
        },
      ]),
    ),
  };
};
