import { ResponsiveBar } from "@nivo/bar";

import { BarValueLabels } from "@/components/bar-value-labels";
import { ProbabilityTooltip } from "@/components/probability-tooltip";
import { useTheme } from "@/hooks/use-theme";
import { formatPercent } from "@/utils/format-percent";

import {
  BAR_PADDING,
  CHART_PALETTE,
  ROW_HEIGHT,
  VALUE_LABEL_WIDTH,
} from "./probability-chart.model";
import { ChartDatum, ProbabilityChartProps } from "./probability-chart.type";
import { labelWidth } from "./utils/label-width";
import { toChartData } from "./utils/to-chart-data";

// One probability bar per option or level, the model's pick emphasised.
export const ProbabilityChart = ({ rows, label }: ProbabilityChartProps) => {
  const { resolved } = useTheme();
  const palette = CHART_PALETTE[resolved];

  return (
    <div style={{ height: rows.length * ROW_HEIGHT }}>
      <ResponsiveBar<ChartDatum>
        data={toChartData(rows)}
        keys={["probability"]}
        indexBy="label"
        layout="horizontal"
        valueScale={{ type: "linear", min: 0, max: 1 }}
        indexScale={{ type: "band", round: true }}
        padding={BAR_PADDING}
        margin={{
          top: 0,
          right: VALUE_LABEL_WIDTH,
          bottom: 0,
          left: labelWidth(rows),
        }}
        colors={({ data }) => (data.picked ? palette.accent : palette.rest)}
        borderRadius={4}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        axisBottom={null}
        axisLeft={{ tickSize: 0, tickPadding: 8 }}
        theme={{
          text: { fontFamily: "inherit", fontSize: 12, fill: palette.ink },
          axis: { ticks: { text: { fill: palette.ink } } },
        }}
        layers={["bars", "axes", BarValueLabels]}
        tooltip={ProbabilityTooltip}
        ariaLabel={label}
        barAriaLabel={({ indexValue, value }) =>
          `${indexValue}: ${formatPercent(value ?? 0)}`
        }
      />
    </div>
  );
};
