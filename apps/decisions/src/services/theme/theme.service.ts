import { ResolvedTheme, ThemePreference } from "./theme.type";
import { parsePreference } from "./utils/parse-preference";
import { readStoredTheme } from "./utils/read-stored-theme";
import { resolveTheme } from "./utils/resolve-theme";
import { writeStoredTheme } from "./utils/write-stored-theme";

// The single owner of the theme: the stored preference, the OS setting it
// falls back to, and the `.dark` class shadcn's styles key off. React reads
// it through useSyncExternalStore (useTheme), so there is no second copy.
class ThemeService {
  private preference = parsePreference(readStoredTheme());
  private readonly media = window.matchMedia("(prefers-color-scheme: dark)");
  private readonly listeners = new Set<() => void>();

  constructor() {
    this.media.addEventListener("change", () => {
      if (this.preference === "system") this.update();
    });
    this.apply();
  }

  private apply(): void {
    const resolved = this.getResolved();
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    // Native controls and scrollbars follow too.
    root.style.colorScheme = resolved;
  }

  private update(): void {
    this.apply();
    for (const listener of this.listeners) listener();
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getPreference = (): ThemePreference => this.preference;

  getResolved = (): ResolvedTheme =>
    resolveTheme(this.preference, this.media.matches);

  setPreference = (preference: ThemePreference): void => {
    this.preference = preference;
    writeStoredTheme(preference);
    this.update();
  };
}

export const themeService = new ThemeService();
