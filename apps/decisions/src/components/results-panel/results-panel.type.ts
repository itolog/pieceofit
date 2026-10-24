import { DecisionStatus } from "@/hooks/use-decision";

export type ResultsPanelProps = {
  status: DecisionStatus;
  // Summary line for a finished request (time, tokens).
  stats?: string;
};
