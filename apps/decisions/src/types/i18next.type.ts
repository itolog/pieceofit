import en from "@/locales/en.json";

// Types `t()` against the English resources, so a missing or misspelt key is
// a compile error. Other locales are held to the same keys by a unit test.
declare module "i18next" {
  interface CustomTypeOptions {
    resources: { translation: typeof en };
  }
}
