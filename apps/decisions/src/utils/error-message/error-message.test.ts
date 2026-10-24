import { describe, expect, it } from "vitest";

import { errorMessage } from "./error-message.util";

describe("errorMessage", () => {
  it("unwraps an Error and stringifies anything else", () => {
    expect(errorMessage(new Error("timeout"))).toBe("timeout");
    expect(errorMessage("boom")).toBe("boom");
  });
});
