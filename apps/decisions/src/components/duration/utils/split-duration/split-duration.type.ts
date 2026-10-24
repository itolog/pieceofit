/** A duration in the units Intl.DurationFormat should show. */
export type DurationRecord =
  /** Under a minute: seconds plus tenths, as milliseconds. */
  | { seconds: number; milliseconds: number }
  /** A minute or more: whole minutes and seconds. */
  | { minutes: number; seconds: number };
