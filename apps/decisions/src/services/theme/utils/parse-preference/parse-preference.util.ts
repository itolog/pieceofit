import { ThemePreference } from "../../theme.type";

// Reads a stored or selected value back; anything unknown (or nothing) means
// "system".
export const parsePreference = (value: string | null): ThemePreference =>
  value === "light" || value === "dark" ? value : "system";
