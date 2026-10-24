// A caught value as display text: an Error's message, anything else as is.
export const errorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};
