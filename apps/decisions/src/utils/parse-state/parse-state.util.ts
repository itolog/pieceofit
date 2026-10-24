import { DecisionState } from "@/types/decision.type";

// Turns the state text into the request `state`: text that parses as a JSON
// object or array is sent as structured input, anything else as plain text.
export const parseState = (text: string): DecisionState => {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return text;
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed === "object" && parsed !== null) {
      return Array.isArray(parsed) ? parsed : { ...parsed };
    }
  } catch {
    // Not valid JSON — send it as text.
  }
  return text;
};
