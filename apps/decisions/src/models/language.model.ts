export const LANGUAGES = ["en", "uk"] as const;

export const FALLBACK_LANGUAGE = "en";

// Each language is listed in its own name, so it is findable whatever the
// current UI language is.
export const LANGUAGE_NAMES = {
  en: "English",
  uk: "Українська",
} as const;
