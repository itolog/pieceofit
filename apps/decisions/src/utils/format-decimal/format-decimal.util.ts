// A number with a fixed count of decimals, in the locale's notation:
// 2.738 → "2.74" (en), "2,74" (uk).
export const formatDecimal = (
  value: number,
  fractionDigits: number,
  locale = "en",
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};
