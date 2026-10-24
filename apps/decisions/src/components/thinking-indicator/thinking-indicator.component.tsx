import { useTranslation } from "react-i18next";

import { ScannerBar } from "@/components/scanner-bar";
import { useElapsed } from "@/hooks/use-elapsed";
import { useTick } from "@/hooks/use-tick";
import { bounceIndex } from "@/utils/bounce-index";
import { formatDecimal } from "@/utils/format-decimal";

import {
  SPINNER_FRAMES,
  SPINNER_STEP_MS,
  VERB_KEYS,
  VERB_STEP_MS,
} from "./thinking-indicator.model";
import { ThinkingIndicatorProps } from "./thinking-indicator.type";

// The in-flight request: a pulsing glyph, a rotating status phrase with a
// colour sweep, a live timer and a scanner bar. Screen readers get one
// polite status line, not every animation frame.
export const ThinkingIndicator = ({ model }: ThinkingIndicatorProps) => {
  const { t, i18n } = useTranslation();
  const frame = bounceIndex(useTick(SPINNER_STEP_MS), SPINNER_FRAMES.length);
  const verb =
    VERB_KEYS[useTick(VERB_STEP_MS) % VERB_KEYS.length] ?? VERB_KEYS[0];
  const seconds = formatDecimal(useElapsed() / 1000, 1, i18n.language);

  return (
    <div className="bg-card ring-foreground/10 flex flex-col gap-3 rounded-xl p-4 shadow-sm ring-1">
      <output className="flex items-center gap-3">
        <span
          aria-hidden
          className="text-primary w-5 text-center text-xl leading-none drop-shadow-[0_0_6px_var(--primary)]">
          {SPINNER_FRAMES[frame]}
        </span>
        <span className="text-shimmer font-medium">{t(verb)}…</span>
        <span className="text-muted-foreground ml-auto font-mono text-xs tabular-nums">
          {t("loading.elapsed", { seconds })}
        </span>
      </output>
      <ScannerBar />
      <p className="text-muted-foreground text-xs">
        {t("loading.hint", { model })}
      </p>
    </div>
  );
};
