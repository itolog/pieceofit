import { FlagComponent, GB, UA } from "country-flag-icons/react/3x2";

import { Language } from "@/types/language.type";

// A visual cue next to the language's own name, which stays the real label:
// a flag marks a country, not a language (English is shown with the UK's).
export const LANGUAGE_FLAGS: Record<Language, FlagComponent> = {
  en: GB,
  uk: UA,
};

// 3:2 flags with a hairline edge, so white stripes don't melt into the
// background in light mode.
export const FLAG_CLASS =
  "h-3.5 w-[21px] shrink-0 rounded-[2px] ring-1 ring-foreground/15";
