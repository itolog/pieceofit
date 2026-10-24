import { describe, expect, it } from "vitest";

import { withTimeout } from "./with-timeout.util";

describe("withTimeout", () => {
  it("aborts when the caller's signal does", () => {
    const controller = new AbortController();
    const signal = withTimeout(60_000, controller.signal);
    expect(signal.aborted).toBe(false);
    controller.abort();
    expect(signal.aborted).toBe(true);
  });

  it("aborts on its own after the timeout", async () => {
    const signal = withTimeout(5);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(signal.aborted).toBe(true);
  });
});
