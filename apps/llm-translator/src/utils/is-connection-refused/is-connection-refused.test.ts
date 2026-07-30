import { describe, expect, it } from "vitest";

import { isConnectionRefused } from "./is-connection-refused.util";

describe("isConnectionRefused", () => {
  it("matches the Bun shape (code on the error itself)", () => {
    const error = Object.assign(new Error("Unable to connect."), {
      code: "ConnectionRefused",
    });
    expect(isConnectionRefused(error)).toBe(true);
  });

  it("matches the Node shape (code on cause)", () => {
    const error = Object.assign(new TypeError("fetch failed"), {
      cause: Object.assign(new Error("connect ECONNREFUSED"), {
        code: "ECONNREFUSED",
      }),
    });
    expect(isConnectionRefused(error)).toBe(true);
  });

  it("does not match an unrelated error, a bare message, or a non-error", () => {
    expect(isConnectionRefused(new Error("ECONNREFUSED"))).toBe(false);
    expect(
      isConnectionRefused(
        Object.assign(new Error("nope"), { code: "ENOTFOUND" }),
      ),
    ).toBe(false);
    expect(isConnectionRefused("ECONNREFUSED")).toBe(false);
    expect(isConnectionRefused(undefined)).toBe(false);
  });
});
