import { FALLBACK_LANGUAGE, LANGUAGES } from "../../i18n.model";
import { Language } from "../../i18n.type";

// Narrows a detected or selected language tag ("uk", "uk-UA", "de") to a
// supported language, by its primary subtag; anything else falls back.
export const parseLanguage = (value: string | undefined): Language => {
  const primary = value?.toLowerCase().split("-")[0];
  return (
    LANGUAGES.find((language) => language === primary) ?? FALLBACK_LANGUAGE
  );
};
