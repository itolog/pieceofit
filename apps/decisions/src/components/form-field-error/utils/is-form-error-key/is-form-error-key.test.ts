import { describe, expect, it } from "vitest";

import { isFormErrorKey } from "./is-form-error-key.util";

describe("isFormErrorKey", () => {
  it("recognises the form's own message keys", () => {
    expect(isFormErrorKey("errors.required")).toBe(true);
    expect(isFormErrorKey("Invalid input")).toBe(false);
  });
});
