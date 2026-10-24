import { errorResponseSchema } from "../../ollama.schema";

// Ollama's own message (`{ "error": "..." }`), else the HTTP status line.
export const readError = async (res: Response): Promise<string> => {
  const body = errorResponseSchema.safeParse(
    await res.json().catch(() => null),
  );
  return body.success
    ? body.data.error
    : `HTTP ${res.status} ${res.statusText}`;
};
