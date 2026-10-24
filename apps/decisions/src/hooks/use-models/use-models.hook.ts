import { useCallback, useEffect, useRef, useState } from "react";

import { ModelsState } from "./use-models.type";
import { fetchModels } from "./utils/fetch-models";

// Installed decision models, loaded on mount and on demand (after
// `ollama pull`, or once Ollama is started). A reload keeps showing the
// previous list until the new one arrives, so the form stays mounted.
export const useModels = () => {
  const [state, setState] = useState<ModelsState>({ kind: "loading" });
  const controllerRef = useRef<AbortController | null>(null);

  const reload = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    void fetchModels(controller.signal).then((next) => {
      if (!controller.signal.aborted) setState(next);
    });
  }, []);

  useEffect(() => {
    reload();
    return () => controllerRef.current?.abort();
  }, [reload]);

  return { state, reload };
};
