import {
  MS_PER_SECOND,
  MS_PER_TENTH,
  SECONDS_PER_MINUTE,
  TENTHS_PER_SECOND,
} from "./split-duration.model";
import { DurationRecord } from "./split-duration.type";

// Splits milliseconds into the units a person reads: tenths of a second
// under a minute, whole minutes and seconds from a minute on. Intl does not
// carry units over (90 s stays "90 s"), so this is where they are balanced.
export const splitDuration = (ms: number): DurationRecord => {
  const tenths = Math.round(Math.max(0, ms) / MS_PER_TENTH);
  if (tenths < SECONDS_PER_MINUTE * TENTHS_PER_SECOND) {
    return {
      seconds: Math.floor(tenths / TENTHS_PER_SECOND),
      milliseconds: (tenths % TENTHS_PER_SECOND) * MS_PER_TENTH,
    };
  }
  const seconds = Math.round(ms / MS_PER_SECOND);
  return {
    minutes: Math.floor(seconds / SECONDS_PER_MINUTE),
    seconds: seconds % SECONDS_PER_MINUTE,
  };
};
