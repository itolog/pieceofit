import { listDecisionModels } from "@/services/ollama";

import { ModelsState } from "../../use-models.type";

// Loads the model list and folds the outcome into the hook's state, so the
// hook only has to store it. Never rejects.
export const fetchModels = (signal: AbortSignal): Promise<ModelsState> =>
  listDecisionModels(signal).then(
    (models): ModelsState => ({ kind: "ready", models }),
    (error: unknown): ModelsState => ({
      kind: "error",
      message: error instanceof Error ? error.message : String(error),
    }),
  );
