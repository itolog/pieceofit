import { THEME_STORAGE_KEY } from "../../theme.model";

// Storage can be unavailable (private mode, blocked site data); that reads
// as "nothing stored".
export const readStoredTheme = (): string | null => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};
