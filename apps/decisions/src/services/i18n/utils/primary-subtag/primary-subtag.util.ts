// The language part of a tag: "uk-UA" → "uk". Unlike parseLanguage it keeps
// unsupported languages, so the detector can still skip past them ("ru")
// to a later supported one in the browser's list.
export const primarySubtag = (tag: string): string => {
  return tag.toLowerCase().split("-")[0] ?? tag;
};
