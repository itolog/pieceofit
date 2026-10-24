import { AnswerRow } from "@/types/answer-row.type";

import { ChartDatum } from "../../probability-chart.type";

// Nivo draws a horizontal bar chart bottom-up, so the rows are reversed to
// read top-down in their original order (options as given, levels low→high).
export const toChartData = (rows: AnswerRow[]): ChartDatum[] =>
  rows
    .map((row) => ({
      label: row.label,
      probability: row.probability,
      picked: row.picked ? 1 : 0,
    }))
    .toReversed();
