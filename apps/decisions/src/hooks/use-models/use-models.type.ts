import { DecisionModel } from "@/services/ollama";

export type ModelsState =
  | { kind: "loading" }
  | { kind: "ready"; models: DecisionModel[] }
  | { kind: "error"; message: string };
