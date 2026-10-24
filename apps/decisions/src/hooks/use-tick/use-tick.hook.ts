import { useEffect, useState } from "react";

import { REDUCED_MOTION_QUERY } from "./use-tick.model";

// A counter that advances every `intervalMs`, for frame-based animation.
// It stays at 0 for users who prefer reduced motion.
export const useTick = (intervalMs: number): number => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const id = reduced
      ? undefined
      : setInterval(() => setTick((n) => n + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return tick;
};
