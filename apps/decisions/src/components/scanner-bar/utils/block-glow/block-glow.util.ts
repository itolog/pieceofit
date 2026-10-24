import { SCANNER_GLOW_FLOOR, SCANNER_TRAIL } from "../../scanner-bar.model";

// Brightness (0..1) of a block by its distance from the scanner head: full at
// the head, fading over the trail, then a dim floor so the bar stays visible.
export const blockGlow = (index: number, head: number): number => {
  const distance = Math.abs(index - head);
  const trail = Math.max(0, 1 - distance / SCANNER_TRAIL);
  return SCANNER_GLOW_FLOOR + (1 - SCANNER_GLOW_FLOOR) * trail;
};
