import { ResolvedTheme, ThemePreference } from "../../theme.type";

export const resolveTheme = (
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme =>
  preference === "system" ? (systemDark ? "dark" : "light") : preference;
