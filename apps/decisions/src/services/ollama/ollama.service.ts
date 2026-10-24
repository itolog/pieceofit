import { DecisionRequest } from "@/types/decision.type";

import { BASE_URL, DECIDE_TIMEOUT_MS, TAGS_TIMEOUT_MS } from "./ollama.model";
import { decisionResponseSchema, tagsResponseSchema } from "./ollama.schema";
import { DecideResult, DecisionModel } from "./ollama.type";
import { readError } from "./utils/read-error";
import { withTimeout } from "./utils/with-timeout";

// Installed models that can answer decision questions. Ollama tags them with
// the `decision` capability; everything else would fail on /v1/systemone.
export const listDecisionModels = async (
  signal?: AbortSignal,
): Promise<DecisionModel[]> => {
  const res = await fetch(`${BASE_URL}/api/tags`, {
    signal: withTimeout(TAGS_TIMEOUT_MS, signal),
  });
  if (!res.ok) throw new Error(await readError(res));

  const { models } = tagsResponseSchema.parse(await res.json());
  return models
    .filter((model) => model.capabilities?.includes("decision"))
    .map((model) => ({
      name: model.name,
      vision: model.capabilities?.includes("vision") ?? false,
    }));
};

// One call to the decision endpoint. Decision models are not in Ollama's JS
// library yet, so this is a raw fetch.
export const decide = async (
  request: DecisionRequest,
  signal?: AbortSignal,
): Promise<DecideResult> => {
  const startedAt = performance.now();
  const res = await fetch(`${BASE_URL}/v1/systemone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal: withTimeout(DECIDE_TIMEOUT_MS, signal),
  });
  if (!res.ok) throw new Error(await readError(res));

  const parsed = decisionResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new Error(
      `Unexpected response from /v1/systemone: ${parsed.error.message}`,
    );
  }
  return { response: parsed.data, elapsedMs: performance.now() - startedAt };
};
