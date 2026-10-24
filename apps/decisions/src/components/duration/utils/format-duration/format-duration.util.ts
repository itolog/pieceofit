import { splitDuration } from "../split-duration";
import { MINUTES_FORMAT, SECONDS_FORMAT } from "./format-duration.model";

// A duration in the locale's own words and units, via Intl.DurationFormat —
// no translated strings needed for any language.
export const formatDuration = (ms: number, locale: string): string => {
  const duration = splitDuration(ms);
  const options = "minutes" in duration ? MINUTES_FORMAT : SECONDS_FORMAT;
  return new Intl.DurationFormat(locale, options).format(duration);
};
