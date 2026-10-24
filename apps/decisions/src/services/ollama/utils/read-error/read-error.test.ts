import { describe, expect, it } from "vitest";

import { readError } from "./read-error.util";

describe("readError", () => {
  it("returns Ollama's error message", async () => {
    const res = Response.json(
      { error: "model 'd3' not found" },
      { status: 404 },
    );
    expect(await readError(res)).toBe("model 'd3' not found");
  });

  it("falls back to the status line for a non-JSON body", async () => {
    const res = new Response("<html>", {
      status: 502,
      statusText: "Bad Gateway",
    });
    expect(await readError(res)).toBe("HTTP 502 Bad Gateway");
  });
});
