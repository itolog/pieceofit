import { useCallback, useEffect, useRef, useState } from "react";

import { decide } from "@/services/ollama";
import { DecisionRequest } from "@/types/decision.type";
import { errorMessage } from "@/utils/error-message";

import { DecisionStatus } from "./use-decision.type";
import { isModelNotFound } from "./utils/is-model-not-found";

// Sends one decision request at a time: a new run aborts the previous one,
// so only the latest answer ever lands.
export const useDecision = () => {
  const [status, setStatus] = useState<DecisionStatus>({ kind: "idle" });
  const controllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    abort();
    setStatus({ kind: "idle" });
  }, [abort]);

  const run = useCallback(
    async (request: DecisionRequest) => {
      abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setStatus({ kind: "loading", request });
      try {
        const result = await decide(request, controller.signal);
        if (!controller.signal.aborted) {
          setStatus({ kind: "done", request, result });
        }
      } catch (error) {
        // Superseded or cancelled: whoever aborted already owns the status.
        if (controller.signal.aborted) return;
        const message = errorMessage(error);
        setStatus({
          kind: "error",
          request,
          message,
          modelMissing: isModelNotFound(message),
        });
      }
    },
    [abort],
  );

  useEffect(() => abort, [abort]);

  return { status, run, cancel };
};
