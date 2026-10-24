// Probability (0..1) as a percentage with one decimal: 0.9868 → "98.7%".
export const formatPercent = (probability: number): string =>
  `${(probability * 100).toFixed(1)}%`;
