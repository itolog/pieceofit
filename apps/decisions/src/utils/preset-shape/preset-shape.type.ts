export type PresetShape = {
  state: "text" | "json";
  questions: Record<string, { type: string; criteria: string[] | number }>;
};
