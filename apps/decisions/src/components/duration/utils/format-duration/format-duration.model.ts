// Under a minute: "3,7 с". The milliseconds become the seconds' decimals,
// and seconds always show, or a zero duration would format as "".
export const SECONDS_FORMAT: Intl.DurationFormatOptions = {
  style: "short",
  secondsDisplay: "always",
  milliseconds: "numeric",
  fractionalDigits: 1,
};

// From a minute on: "1 хв і 5 с".
export const MINUTES_FORMAT: Intl.DurationFormatOptions = { style: "short" };
