import { describe, expect, it } from "vitest";

import { primarySubtag } from "./primary-subtag.util";

describe("primarySubtag", () => {
  it("drops the region, keeping unsupported languages as they are", () => {
    expect(primarySubtag("uk-UA")).toBe("uk");
    expect(primarySubtag("ru-UA")).toBe("ru");
    expect(primarySubtag("EN")).toBe("en");
  });
});
