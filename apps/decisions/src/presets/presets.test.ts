import { describe, expect, it } from "vitest";

import { LANGUAGES } from "@/models/language.model";
import { presetShape } from "@/utils/preset-shape";

import { PRESETS } from "./presets.model";

// Translations may reword everything a person reads, but question keys,
// types, option names and level counts are what the API returns and code
// reads — they must not drift between languages.
describe("presets", () => {
  it.each(PRESETS.map((preset) => [preset.id, preset] as const))(
    "%s has the same shape in every language",
    (_, preset) => {
      const english = presetShape(preset.bodies.en);
      for (const language of LANGUAGES) {
        expect(presetShape(preset.bodies[language])).toEqual(english);
      }
    },
  );
});
