// Ping-pongs a running counter across `length` slots: 0 1 2 … n-1 … 2 1 0 1 …
// Drives the spinner glyph and the scanner head.
export const bounceIndex = (tick: number, length: number): number => {
  if (length <= 1) return 0;
  const period = 2 * (length - 1);
  const position = tick % period;
  return position < length ? position : period - position;
};
