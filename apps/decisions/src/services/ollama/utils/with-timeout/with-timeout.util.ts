// A signal that aborts after `ms`, or earlier when the caller's `signal` does.
export const withTimeout = (ms: number, signal?: AbortSignal): AbortSignal =>
  signal
    ? AbortSignal.any([signal, AbortSignal.timeout(ms)])
    : AbortSignal.timeout(ms);
