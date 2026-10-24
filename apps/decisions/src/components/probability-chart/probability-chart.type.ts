import { AnswerRow } from "@/types/answer-row.type";

export type ProbabilityChartProps = {
  rows: AnswerRow[];
  // Accessible summary of what the chart shows.
  label: string;
  /** Row labels are API identifiers (choice options), set in monospace. */
  identifiers?: boolean;
};

// Nivo's BarDatum allows only strings and numbers, so `picked` is 0 / 1.
export type ChartDatum = {
  label: string;
  probability: number;
  picked: number;
};
