import { useTheme as useNivoTheme } from "@nivo/theming";
import { useTranslation } from "react-i18next";

import { formatPercent } from "@/utils/format-percent";

import { BarValueLabelsProps } from "./bar-value-labels.type";

// SVG labels just past each horizontal bar's tip, outside the mark, so a
// tiny bar never clips its own value. A Nivo custom layer: it renders inside
// the chart's theme, and takes the text ink from there rather than the bar
// colour.
export const BarValueLabels = ({ bars }: BarValueLabelsProps) => {
  const { text } = useNivoTheme();
  const { i18n } = useTranslation();
  return (
    <g>
      {bars.map((bar) => (
        <text
          key={bar.key}
          x={bar.x + bar.width + 6}
          y={bar.y + bar.height / 2}
          dominantBaseline="central"
          fontSize={12}
          fill={text.fill}
          style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatPercent(bar.data.value ?? 0, i18n.language)}
        </text>
      ))}
    </g>
  );
};
