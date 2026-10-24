// Ollama's answer when the requested model is not pulled — the one failure
// with a known fix (`ollama pull`).
export const isModelNotFound = (message: string): boolean => {
  return /model .* not found/i.test(message);
};
