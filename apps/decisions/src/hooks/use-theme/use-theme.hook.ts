import { useSyncExternalStore } from "react";

import { themeService } from "@/services/theme";

// The user's theme choice and the light/dark theme it resolves to right now.
export const useTheme = () => {
  const preference = useSyncExternalStore(
    themeService.subscribe,
    themeService.getPreference,
  );
  const resolved = useSyncExternalStore(
    themeService.subscribe,
    themeService.getResolved,
  );
  return { preference, resolved, setPreference: themeService.setPreference };
};
