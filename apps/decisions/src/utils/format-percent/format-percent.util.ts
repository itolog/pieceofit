// Probability (0..1) as a percentage with one decimal, in the locale's
// notation: 0.9868 → "98.7%" (en), "98,7%" (uk).
export const formatPercent = (probability: number, locale = "en"): string => {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(probability);
};
