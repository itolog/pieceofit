// Limits of the /v1/systemone endpoint.
export const MAX_QUESTIONS = 64;
/** Fewest / most options of a choice question, or levels of a score question. */
export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 26;

export const QUESTION_TYPES = ["noul", "choice", "score"] as const;
