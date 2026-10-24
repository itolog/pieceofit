import { Monitor, Moon, Sun } from "lucide-react";

import { ThemeOption } from "./theme-toggle.type";

export const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", labelKey: "theme.light", icon: Sun },
  { value: "dark", labelKey: "theme.dark", icon: Moon },
  { value: "system", labelKey: "theme.system", icon: Monitor },
];
