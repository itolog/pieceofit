import { OllamaTag } from "../../llm-model.type";

const isOllamaTag = (value: unknown): value is OllamaTag =>
  typeof value === "object" &&
  value !== null &&
  "name" in value &&
  typeof value.name === "string" &&
  "model" in value &&
  typeof value.model === "string";

/**
 * Whether `body` (a parsed /api/tags response) has the shape the service reads:
 * an object whose optional `models` is an array of `{ name, model }` strings.
 */
export function isTagsResponse(
  body: unknown,
): body is { models?: OllamaTag[] } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return false;
  }
  if (!("models" in body) || body.models === undefined) return true;
  return Array.isArray(body.models) && body.models.every(isOllamaTag);
}
