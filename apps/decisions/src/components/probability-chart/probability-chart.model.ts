import { ResolvedTheme } from "@/services/theme";

// Emphasis form: the model's pick in the accent hue, the rest in a recessive
// gray. The accent clears 3:1 on both card surfaces (validated with the
// dataviz palette checker: #fff light, #1b1d22 dark — the card surfaces). Text never wears the
// data colour — labels use the ink tones.
export const CHART_PALETTE: Record<
  ResolvedTheme,
  { accent: string; rest: string; ink: string; muted: string }
> = {
  light: {
    accent: "#2a78d6",
    rest: "#c3c2b7",
    ink: "#52514e",
    muted: "#898781",
  },
  dark: {
    accent: "#3987e5",
    rest: "#52514e",
    ink: "#c3c2b7",
    muted: "#898781",
  },
};

// Bars stay at most ~24px thick: a 36px band with 0.35 padding.
export const ROW_HEIGHT = 36;
export const BAR_PADDING = 0.35;

// Room for the value label at each bar's tip ("100.0%").
export const VALUE_LABEL_WIDTH = 52;
