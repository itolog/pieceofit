import { listDecisionModels } from "@/services/ollama";
import { errorMessage } from "@/utils/error-message";

import { ModelsState } from "../../use-models.type";

// Loads the model list and folds the outcome into the hook's state, so the
// hook only has to store it. Never rejects.
export const fetchModels = (signal: AbortSignal): Promise<ModelsState> =>
  listDecisionModels(signal).then(
    (models): ModelsState => ({ kind: "ready", models }),
    (error: unknown): ModelsState => ({
      kind: "error",
      message: errorMessage(error),
    }),
  );
