import { createInstance } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import uk from "@/locales/uk.json";
import {
  MAX_OPTIONS,
  MAX_QUESTIONS,
  MIN_OPTIONS,
} from "@/models/decision.model";

import {
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
} from "./i18n.model";
import { primarySubtag } from "./utils/primary-subtag";
import { syncDocumentLanguage } from "./utils/sync-document-language";

// An instance of our own rather than the global singleton, handed to React
// through I18nextProvider.
const i18n = createInstance();

// The language is detected once (a stored choice first, then the browser's
// languages) and cached on every change, so a pick survives reloads.
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, uk: { translation: uk } },
    supportedLngs: LANGUAGES,
    // "uk-UA" from the browser resolves to "uk".
    nonExplicitSupportedLngs: true,
    fallbackLng: FALLBACK_LANGUAGE,
    // Resources are bundled, so the first render already has them.
    initAsync: false,
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
      // Stored and applied as "uk", not "uk-UA".
      convertDetectedLanguage: primarySubtag,
    },
    interpolation: {
      // React escapes on render.
      escapeValue: false,
      // The endpoint limits that validation messages quote.
      defaultVariables: {
        minOptions: MIN_OPTIONS,
        maxOptions: MAX_OPTIONS,
        maxQuestions: MAX_QUESTIONS,
      },
    },
  });

i18n.on("languageChanged", syncDocumentLanguage);
syncDocumentLanguage(i18n.language ?? FALLBACK_LANGUAGE);

export { i18n };
