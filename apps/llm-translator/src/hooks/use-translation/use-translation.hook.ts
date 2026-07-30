import { useCallback, useEffect, useRef, useState } from "react";

import { OLLAMA_UNREACHABLE_NOTICE } from "@/models/ollama-notice.model";
import { llmModelService, TranslationStats } from "@/services/llm-model";
import { createMessage } from "@/utils/create-message";
import { isConnectionRefused } from "@/utils/is-connection-refused";

import { UseTranslationOptions } from "./use-translation.type";

// Owns the per-request translation flow: loading state, latest stats, and the
// per-submit AbortController (aborted on unmount and superseded by each new
// submit). The service handles timeout/retry/cleaning; this hook only wires
// the streamed tokens into the transcript.
export function useTranslation({
  fromLang,
  toLang,
  modelAvailableRef,
  verifyModel,
  addMessage,
  appendMessage,
  updateMessage,
}: UseTranslationOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<TranslationStats | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleTranslate = useCallback(
    async (text: string) => {
      // A block is usually stale by the time it bites: the common order is
      // "open the TUI, *then* start Ollama / pull the model", and the check
      // that set it ran once at mount. So re-probe (one /api/tags call) instead
      // of refusing for the rest of the session, and let verifyModel report the
      // outcome — it already words each cause correctly.
      if (modelAvailableRef.current === false && !(await verifyModel())) return;
      addMessage("You", text);
      setIsLoading(true);
      // Drop the previous request's stats up front so a failed/cancelled
      // translation doesn't leave the StatsBar showing numbers for it — they
      // are only restored below on success.
      setStats(null);
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Empty bot message created up front; streamed tokens fill it in live.
      const botMessage = createMessage("Bot", "");
      appendMessage(botMessage);

      try {
        const { text: translation, stats: translationStats } =
          await llmModelService.translate({
            text,
            fromLang,
            toLang,
            signal: controller.signal,
            onToken: (partial) => updateMessage(botMessage.id, partial),
          });
        // Fall back to a placeholder so an empty result doesn't leave the card
        // stuck on the spinner (empty bot text renders the loading indicator).
        updateMessage(botMessage.id, translation || "(no translation)");
        setStats(translationStats);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          updateMessage(botMessage.id, "Request cancelled");
        } else if (isConnectionRefused(error)) {
          // The runtime's own text ("Unable to connect. Is the computer able to
          // access the url?") names neither the host nor the fix.
          updateMessage(botMessage.id, OLLAMA_UNREACHABLE_NOTICE);
        } else {
          const message =
            error instanceof Error ? error.message : String(error);
          updateMessage(botMessage.id, `Error: ${message}`);
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [
      addMessage,
      appendMessage,
      updateMessage,
      fromLang,
      toLang,
      modelAvailableRef,
      verifyModel,
    ],
  );

  const resetStats = useCallback(() => setStats(null), []);

  // User-triggered stop (Esc). No-op when idle — the ref is cleared in the
  // `finally` above. The aborted request's own `catch` writes "Request
  // cancelled" onto its card and clears `isLoading`, so there is nothing to
  // unwind here.
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { isLoading, stats, handleTranslate, resetStats, cancel };
}
