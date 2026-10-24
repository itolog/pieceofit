// The message shown for a failed request, with the fix for the common case
// of a model that is not pulled.
export const describeError = (error: unknown, model: string): string => {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("not found")
    ? `${message} — run: ollama pull ${model}`
    : message;
};
