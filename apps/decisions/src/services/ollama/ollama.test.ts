import { afterEach, describe, expect, it, vi } from "vitest";

import { decide, listDecisionModels } from "./ollama.service";

const stubFetch = (status: number, body: unknown) => {
  const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
    Response.json(body, { status }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const request = {
  model: "d3",
  state: "down",
  questions: { urgent: { type: "noul" as const, instructions: "Urgent?" } },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("listDecisionModels", () => {
  it("keeps only decision models and flags vision", async () => {
    stubFetch(200, {
      models: [
        { name: "d3:latest", capabilities: ["decision", "vision"] },
        { name: "tev1:4b", capabilities: ["decision"] },
        { name: "gemma4:12b", capabilities: ["completion"] },
        { name: "old-model" },
      ],
    });
    expect(await listDecisionModels()).toEqual([
      { name: "d3:latest", vision: true },
      { name: "tev1:4b", vision: false },
    ]);
  });
});

describe("decide", () => {
  it("posts the request through the proxy and parses the answers", async () => {
    const answers = { urgent: { type: "noul", noul: 0.97 } };
    const fetchMock = stubFetch(200, { model: "d3", answers });

    const { response } = await decide(request);

    expect(response.answers).toEqual(answers);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("/ollama/v1/systemone");
    expect(init?.body).toBe(JSON.stringify(request));
  });

  it("surfaces Ollama's error message", async () => {
    stubFetch(404, { error: "model 'd3' not found" });
    await expect(decide(request)).rejects.toThrow("model 'd3' not found");
  });

  it("rejects a malformed response body", async () => {
    stubFetch(200, { answers: { urgent: { type: "rank" } } });
    await expect(decide(request)).rejects.toThrow("Unexpected response");
  });
});
