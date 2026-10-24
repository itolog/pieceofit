import { describe, expect, it } from "vitest";

import { fileToImage } from "./file-to-image.util";

describe("fileToImage", () => {
  it("reads the file as raw base64 without a data: prefix", async () => {
    const file = new File(["png-bytes"], "form.png", { type: "image/png" });
    expect(await fileToImage(file)).toEqual({
      name: "form.png",
      mimeType: "image/png",
      data: Buffer.from("png-bytes").toString("base64"),
    });
  });

  it("handles files larger than one chunk", async () => {
    const bytes = new Uint8Array(100_000).map((_, i) => i % 256);
    const image = await fileToImage(new File([bytes], "big.webp"));
    expect(image.data).toBe(Buffer.from(bytes).toString("base64"));
  });
});
