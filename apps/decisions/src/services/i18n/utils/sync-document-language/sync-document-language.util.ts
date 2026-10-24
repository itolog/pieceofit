// Screen readers and the browser's hyphenation follow the page language.
export const syncDocumentLanguage = (language: string): void => {
  document.documentElement.lang = language;
};
