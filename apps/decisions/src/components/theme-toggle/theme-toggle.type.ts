import { Sun } from "lucide-react";

import { ThemePreference } from "@/services/theme";

export type ThemeOption = {
  value: ThemePreference;
  labelKey: `theme.${ThemePreference}`;
  icon: typeof Sun;
};
