// Key of the largest probability; the first one wins a tie, matching the
// model's own tie-break (option order). Undefined for an empty map.
export const argmax = (
  probabilities: Record<string, number>,
): string | undefined => {
  return Object.entries(probabilities).toSorted(
    ([, a], [, b]) => b - a,
  )[0]?.[0];
};
