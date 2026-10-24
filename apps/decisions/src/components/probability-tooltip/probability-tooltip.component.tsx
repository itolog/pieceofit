import { useTranslation } from "react-i18next";

import { formatPercent } from "@/utils/format-percent";

import { ProbabilityTooltipProps } from "./probability-tooltip.type";

// Value first, label second: the reader already knows which bar they hover.
export const ProbabilityTooltip = ({
  indexValue,
  value,
  color,
}: ProbabilityTooltipProps) => {
  const { i18n } = useTranslation();
  return (
    <div className="bg-popover text-popover-foreground flex items-center gap-2 rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md">
      <span className="h-0.5 w-3 rounded-full" style={{ background: color }} />
      <span className="font-medium tabular-nums">
        {formatPercent(value, i18n.language)}
      </span>
      <span className="text-muted-foreground">{indexValue}</span>
    </div>
  );
};
