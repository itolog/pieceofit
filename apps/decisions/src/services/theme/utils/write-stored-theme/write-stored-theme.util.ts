import { THEME_STORAGE_KEY } from "../../theme.model";
import { ThemePreference } from "../../theme.type";

// "system" is the absence of a choice, so it clears the key. When storage is
// unavailable the choice still applies, it just is not remembered.
export const writeStoredTheme = (preference: ThemePreference): void => {
  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Not persisted.
  }
};
