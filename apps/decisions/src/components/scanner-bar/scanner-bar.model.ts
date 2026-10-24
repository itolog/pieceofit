export const SCANNER_BLOCKS = 18;
export const SCANNER_STEP_MS = 70;
/** How many blocks the glow trails over on each side of the head. */
export const SCANNER_TRAIL = 5;
/** Brightness of a block outside the trail, so the whole bar stays visible. */
export const SCANNER_GLOW_FLOOR = 0.35;

// The bar runs through the page's palette, left to right. Literal class
// names so Tailwind can find them.
export const SCANNER_COLORS = [
  "bg-type-noul",
  "bg-primary",
  "bg-type-choice",
  "bg-type-score",
];
