import { afterEach, describe, expect, it, vi } from "vitest";

import { listDecisionModels } from "@/services/ollama";

import { fetchModels } from "./fetch-models.util";

vi.mock("@/services/ollama", () => ({ listDecisionModels: vi.fn() }));

afterEach(() => {
  vi.mocked(listDecisionModels).mockReset();
});

describe("fetchModels", () => {
  it("wraps the list in a ready state", async () => {
    vi.mocked(listDecisionModels).mockResolvedValue([
      { name: "d3:latest", vision: true },
    ]);
    expect(await fetchModels(new AbortController().signal)).toEqual({
      kind: "ready",
      models: [{ name: "d3:latest", vision: true }],
    });
  });

  it("turns a failure into an error state instead of rejecting", async () => {
    vi.mocked(listDecisionModels).mockRejectedValue(new Error("HTTP 502"));
    expect(await fetchModels(new AbortController().signal)).toEqual({
      kind: "error",
      message: "HTTP 502",
    });
  });
});
