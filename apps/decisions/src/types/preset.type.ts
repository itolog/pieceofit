import { z } from "zod";

import { presetSchema } from "@/schemas/preset.schema";

/** One question of a preset, in wire format. */
export type PresetQuestion = z.infer<typeof presetSchema>["questions"][string];
