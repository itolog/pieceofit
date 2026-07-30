import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { match } from "ts-pattern";

import {
  OLLAMA_TIMEOUT_NOTICE,
  OLLAMA_UNREACHABLE_NOTICE,
} from "@/models/ollama-notice.model";
import { llmModelService, TagsFailure } from "@/services/llm-model";

import { UseModelOptions } from "./use-model.type";

// Owns model/temperature runtime state: the picker/stepper visibility, the
// startup resolution + availability tracking, and the apply/select/cancel
// actions shared by the `/model`|`/temp` commands and their interactive UIs.
// The active model/temperature are read straight from the service (the single
// source of truth) via useSyncExternalStore, so switching them re-renders the
// UI without a duplicate copy in component state. `modelAvailableRef` is
// exposed so the translation flow can block requests against a model Ollama
// does not have pulled.
export function useModel({ addMessage }: UseModelOptions) {
  const model = useSyncExternalStore(
    llmModelService.subscribe,
    llmModelService.getModel,
  );
  const temp = useSyncExternalStore(
    llmModelService.subscribe,
    llmModelService.getTemperature,
  );

  // Non-null while the model picker is open (holds the installed model tags).
  const [modelItems, setModelItems] = useState<string[] | null>(null);
  const [tempPickerOpen, setTempPickerOpen] = useState(false);

  const modelAvailableRef = useRef<boolean | null>(null);

  // Reports why an /api/tags lookup came back empty-handed. Deliberately says
  // nothing about pulling a model: the lookup failed, so nothing was learned
  // about which models exist — telling the user to `ollama pull` here is what
  // used to send them after the wrong fix.
  const reportTagsFailure = useCallback(
    (failure: TagsFailure) => {
      addMessage(
        "Bot",
        failure.status === "timeout"
          ? OLLAMA_TIMEOUT_NOTICE
          : OLLAMA_UNREACHABLE_NOTICE,
      );
    },
    [addMessage],
  );

  // Re-checks the active model (after a manual /model switch it may not be
  // pulled, and a startup block may since have been fixed), warns about
  // whatever it finds, and reports whether translation can go ahead. The
  // boolean is returned rather than read back off `modelAvailableRef` so
  // callers don't have to reason about when the ref was written.
  const verifyModel = useCallback(async (): Promise<boolean> => {
    const result = await llmModelService.checkModelAvailable();

    return (
      match(result)
        .with({ status: "available" }, () => {
          modelAvailableRef.current = true;
          return true;
        })
        .with({ status: "missing" }, () => {
          modelAvailableRef.current = false;
          const active = llmModelService.getModel();
          addMessage(
            "Bot",
            `Error: Model "${active}" is not available. Please pull the model first using: ollama pull ${active}`,
          );
          return false;
        })
        // Nothing was learned about the model, so leave availability unknown
        // (null) rather than blocking translation on a guess.
        .with({ status: "unreachable" }, { status: "timeout" }, (failure) => {
          modelAvailableRef.current = null;
          reportTagsFailure(failure);
          return false;
        })
        .exhaustive()
    );
  }, [addMessage, reportTagsFailure]);

  // Startup: adapt to whatever Ollama has installed instead of trusting the
  // configured default blindly (it may not be pulled on this machine).
  const initModel = useCallback(async () => {
    const result = await llmModelService.resolveStartupModel();

    match(result)
      .with({ status: "no-models" }, () => {
        modelAvailableRef.current = false;
        addMessage(
          "Bot",
          "No models are installed. Pull one first, e.g.: ollama pull gemma3:4b",
        );
      })
      .with({ status: "fallback" }, ({ model }) => {
        const wanted = llmModelService.getModel();
        llmModelService.setModel(model);
        addMessage(
          "Bot",
          `Model "${wanted}" is not installed — switched to "${model}". Use /model to pick another.`,
        );
        modelAvailableRef.current = true;
      })
      .with({ status: "ok" }, () => {
        modelAvailableRef.current = true;
      })
      .with({ status: "unreachable" }, { status: "timeout" }, (failure) => {
        modelAvailableRef.current = null;
        reportTagsFailure(failure);
      })
      .exhaustive();
  }, [addMessage, reportTagsFailure]);

  useEffect(() => {
    initModel();
  }, [initModel]);

  // Switches the active model (shared by `/model <name>` and the picker).
  const applyModel = useCallback(
    async (model: string) => {
      llmModelService.setModel(model);
      addMessage("Bot", `Model changed to: ${model}`);
      await verifyModel();
    },
    [addMessage, verifyModel],
  );

  // Opens the interactive picker for bare `/model` — unless the listing is
  // empty or could not be read, in which case it reports the actual reason
  // instead of showing an empty list.
  const openModelPicker = useCallback(async () => {
    const result = await llmModelService.listModels();

    match(result)
      .with({ status: "ok" }, ({ models }) => {
        if (models.length === 0) {
          addMessage(
            "Bot",
            "No models found. Pull one first: ollama pull <name>",
          );
          return;
        }
        setModelItems(models);
      })
      .with({ status: "unreachable" }, { status: "timeout" }, reportTagsFailure)
      .exhaustive();
  }, [addMessage, reportTagsFailure]);

  const selectModel = useCallback(
    async (model: string) => {
      setModelItems(null);
      await applyModel(model);
    },
    [applyModel],
  );

  const cancelModelPicker = useCallback(() => setModelItems(null), []);

  // Updates the sampling temperature (shared by `/temp <value>` and the stepper).
  const applyTemp = useCallback(
    (temp: number) => {
      llmModelService.setTemperature(temp);
      addMessage("Bot", `Temperature changed to: ${temp}`);
    },
    [addMessage],
  );

  const openTempPicker = useCallback(() => setTempPickerOpen(true), []);

  const selectTemp = useCallback(
    (temp: number) => {
      setTempPickerOpen(false);
      applyTemp(temp);
    },
    [applyTemp],
  );

  const cancelTempPicker = useCallback(() => setTempPickerOpen(false), []);

  return {
    model,
    temp,
    modelItems,
    tempPickerOpen,
    modelAvailableRef,
    verifyModel,
    applyModel,
    openModelPicker,
    selectModel,
    cancelModelPicker,
    applyTemp,
    openTempPicker,
    selectTemp,
    cancelTempPicker,
  };
}
