import { ImageValue } from "@/types/decision-form.type";

import { CHUNK_SIZE } from "./file-to-image.model";

// Reads a picked file as raw base64 — the endpoint rejects `data:` URLs.
export const fileToImage = async (file: File): Promise<ImageValue> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return { name: file.name, mimeType: file.type, data: btoa(binary) };
};
