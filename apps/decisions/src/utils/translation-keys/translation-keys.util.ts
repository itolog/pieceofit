import { PLURAL_SUFFIX } from "./translation-keys.model";

// Every leaf key of a resource object as a dotted path, with plural suffixes
// folded into their base key: languages need different plural forms
// (en: one/other, uk: one/few/many/other) for the same message.
export const translationKeys = (resource: object, prefix = ""): string[] => {
  const keys = Object.entries(resource).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null
      ? translationKeys(value, path)
      : [path.replace(PLURAL_SUFFIX, "")];
  });
  return [...new Set(keys)].toSorted();
};
