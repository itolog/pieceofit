import { useTick } from "@/hooks/use-tick";
import { bounceIndex } from "@/utils/bounce-index";

import {
  SCANNER_BLOCKS,
  SCANNER_COLORS,
  SCANNER_STEP_MS,
} from "./scanner-bar.model";
import { blockGlow } from "./utils/block-glow";

const BLOCKS = Array.from({ length: SCANNER_BLOCKS }, (_, index) => index);

// A row of blocks with a bright head sweeping back and forth, trailing a
// glow — decoration only, hidden from assistive tech.
export const ScannerBar = () => {
  const head = bounceIndex(useTick(SCANNER_STEP_MS), SCANNER_BLOCKS);

  return (
    <div aria-hidden className="flex h-2 gap-1">
      {BLOCKS.map((index) => (
        <span
          key={index}
          className={`flex-1 rounded-full transition-opacity duration-150 ${
            SCANNER_COLORS[
              Math.floor((index / SCANNER_BLOCKS) * SCANNER_COLORS.length)
            ]
          } ${index === head ? "shadow-[0_0_10px_2px] shadow-primary/60" : ""}`}
          style={{ opacity: blockGlow(index, head) }}
        />
      ))}
    </div>
  );
};
