import { useEffect, useState } from "react";

import { ELAPSED_UPDATE_MS } from "./use-elapsed.model";

// Milliseconds since the component mounted, refreshed a few times a second.
// Unlike useTick it keeps running under reduced motion: it is information,
// not decoration.
export const useElapsed = (): number => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    const id = setInterval(
      () => setElapsed(performance.now() - startedAt),
      ELAPSED_UPDATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return elapsed;
};
