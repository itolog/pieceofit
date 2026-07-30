// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OLLAMA_UNREACHABLE_NOTICE } from "@/models/ollama-notice.model";
import { Message } from "@/types/message.type";

import { UseTranslationOptions } from "./use-translation.type";

const { mockTranslate } = vi.hoisted(() => ({ mockTranslate: vi.fn() }));

vi.mock("@/services/llm-model", () => ({
  llmModelService: {
    translate: mockTranslate,
    getModel: () => "gemma4:12b-mlx",
  },
}));

import { useTranslation } from "./use-translation.hook";

const fakeStats = {
  elapsedMs: 100,
  promptTokens: 1,
  completionTokens: 2,
  totalTokens: 3,
  tokensPerSecond: 20,
};
const translationResult = (text: string) => ({ text, stats: fakeStats });

function setup(overrides: Partial<UseTranslationOptions> = {}) {
  const addMessage = vi.fn();
  const appendMessage = vi.fn<(message: Message) => void>();
  const updateMessage = vi.fn();
  // Stands in for useModel's re-check: reports the outcome itself, so this hook
  // only reads the boolean.
  const verifyModel = vi.fn<() => Promise<boolean>>().mockResolvedValue(false);
  const options: UseTranslationOptions = {
    fromLang: "english",
    toLang: "polish",
    modelAvailableRef: { current: true },
    verifyModel,
    addMessage,
    appendMessage,
    updateMessage,
    ...overrides,
  };
  const utils = renderHook(() => useTranslation(options));
  return { ...utils, addMessage, appendMessage, updateMessage, verifyModel };
}

// The id of the bot message appended up front (updateMessage targets it).
const appendedId = (appendMessage: ReturnType<typeof vi.fn>) => {
  const call = appendMessage.mock.calls[0];
  if (!call) throw new Error("expected appendMessage to have been called");
  return (call[0] as Message).id;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useTranslation", () => {
  it("re-checks a blocked model and refuses only if it is still unusable", async () => {
    const { result, verifyModel } = setup({
      modelAvailableRef: { current: false },
    });

    await act(async () => {
      await result.current.handleTranslate("hello");
    });

    expect(verifyModel).toHaveBeenCalledTimes(1);
    expect(mockTranslate).not.toHaveBeenCalled();
  });

  it("goes ahead when the re-check clears a stale block", async () => {
    mockTranslate.mockResolvedValue(translationResult("bonjour"));
    const { result, verifyModel } = setup({
      modelAvailableRef: { current: false },
    });
    verifyModel.mockResolvedValue(true);

    await act(async () => {
      await result.current.handleTranslate("hello");
    });

    expect(mockTranslate).toHaveBeenCalledTimes(1);
  });

  it("does not re-check when availability is known or unknown", async () => {
    mockTranslate.mockResolvedValue(translationResult("bonjour"));
    const { result, verifyModel } = setup({
      modelAvailableRef: { current: null },
    });

    await act(async () => {
      await result.current.handleTranslate("hello");
    });

    expect(verifyModel).not.toHaveBeenCalled();
    expect(mockTranslate).toHaveBeenCalledTimes(1);
  });

  it("adds the user line, streams into the bot line, and stores stats", async () => {
    mockTranslate.mockImplementation(
      async ({ onToken }: { onToken?: (partial: string) => void }) => {
        onToken?.("Bon");
        onToken?.("Bonjour");
        return translationResult("Bonjour");
      },
    );
    const { result, addMessage, appendMessage, updateMessage } = setup();

    await act(async () => {
      await result.current.handleTranslate("hello");
    });

    expect(addMessage).toHaveBeenCalledWith("You", "hello");
    expect(mockTranslate).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "hello",
        fromLang: "english",
        toLang: "polish",
        signal: expect.anything(),
      }),
    );
    const id = appendedId(appendMessage);
    expect(updateMessage).toHaveBeenCalledWith(id, "Bonjour");
    expect(result.current.stats).toMatchObject(fakeStats);
    expect(result.current.isLoading).toBe(false);
  });

  it("falls back to a placeholder for an empty translation", async () => {
    mockTranslate.mockResolvedValue(translationResult(""));
    const { result, appendMessage, updateMessage } = setup();

    await act(async () => {
      await result.current.handleTranslate("hello");
    });

    const id = appendedId(appendMessage);
    expect(updateMessage).toHaveBeenLastCalledWith(id, "(no translation)");
  });

  it("shows a neutral message when the request is aborted", async () => {
    mockTranslate.mockRejectedValue(
      Object.assign(new Error("aborted"), { name: "AbortError" }),
    );
    const { result, appendMessage, updateMessage } = setup();

    await act(async () => {
      await result.current.handleTranslate("hello");
    });

    const id = appendedId(appendMessage);
    expect(updateMessage).toHaveBeenLastCalledWith(id, "Request cancelled");
  });

  it("explains a refused connection instead of echoing the raw fetch error", async () => {
    mockTranslate.mockRejectedValue(
      Object.assign(
        new Error("Unable to connect. Is the computer able to access the url?"),
        { code: "ConnectionRefused" },
      ),
    );
    const { result, appendMessage, updateMessage } = setup();

    await act(async () => {
      await result.current.handleTranslate("hello");
    });

    expect(updateMessage).toHaveBeenLastCalledWith(
      appendedId(appendMessage),
      OLLAMA_UNREACHABLE_NOTICE,
    );
  });

  it("surfaces a generic error as an Error message", async () => {
    mockTranslate.mockRejectedValue(new Error("boom"));
    const { result, appendMessage, updateMessage } = setup();

    await act(async () => {
      await result.current.handleTranslate("hello");
    });

    const id = appendedId(appendMessage);
    expect(updateMessage).toHaveBeenLastCalledWith(id, "Error: boom");
  });

  it("clears the previous request's stats when a translation fails", async () => {
    mockTranslate.mockResolvedValueOnce(translationResult("bonjour"));
    const { result } = setup();

    await act(async () => {
      await result.current.handleTranslate("hello");
    });
    expect(result.current.stats).toMatchObject(fakeStats);

    mockTranslate.mockRejectedValueOnce(new Error("boom"));
    await act(async () => {
      await result.current.handleTranslate("again");
    });
    expect(result.current.stats).toBeNull();
  });

  it("cancel aborts the in-flight request and marks its card", async () => {
    // signal-aware: the service only settles once the request is aborted
    mockTranslate.mockImplementation(
      ({ signal }: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () =>
            reject(Object.assign(new Error("aborted"), { name: "AbortError" })),
          );
        }),
    );
    const { result, appendMessage, updateMessage } = setup();

    let running!: Promise<void>;
    await act(async () => {
      running = result.current.handleTranslate("hello");
    });
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      result.current.cancel();
      await running;
    });

    expect(updateMessage).toHaveBeenLastCalledWith(
      appendedId(appendMessage),
      "Request cancelled",
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("cancel is a no-op when nothing is running", () => {
    const { result, addMessage, updateMessage } = setup();

    act(() => result.current.cancel());

    expect(result.current.isLoading).toBe(false);
    expect(addMessage).not.toHaveBeenCalled();
    expect(updateMessage).not.toHaveBeenCalled();
  });

  it("resetStats clears the stats", async () => {
    mockTranslate.mockResolvedValue(translationResult("bonjour"));
    const { result } = setup();

    await act(async () => {
      await result.current.handleTranslate("hello");
    });
    expect(result.current.stats).toMatchObject(fakeStats);

    act(() => result.current.resetStats());
    expect(result.current.stats).toBeNull();
  });
});
