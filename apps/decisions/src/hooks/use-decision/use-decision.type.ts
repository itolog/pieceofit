import { DecideResult } from "@/services/ollama";
import { DecisionRequest } from "@/types/decision.type";

export type DecisionStatus =
  | { kind: "idle" }
  | { kind: "loading"; request: DecisionRequest }
  | { kind: "done"; request: DecisionRequest; result: DecideResult }
  | { kind: "error"; request: DecisionRequest; message: string };
