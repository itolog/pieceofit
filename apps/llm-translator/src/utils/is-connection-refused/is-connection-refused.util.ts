// Bun and Node report a refused TCP connection with different codes, and
// neither gives it a distinctive `name` (Bun: plain `Error` with
// `code: "ConnectionRefused"`; Node: `TypeError: fetch failed` with
// `cause.code === "ECONNREFUSED"`), so both places are checked.
const REFUSED_CODES = new Set(["ConnectionRefused", "ECONNREFUSED"]);

const hasRefusedCode = (value: unknown): boolean =>
  typeof value === "object" &&
  value !== null &&
  "code" in value &&
  typeof value.code === "string" &&
  REFUSED_CODES.has(value.code);

/**
 * Whether `error` is a connection refused by the host — i.e. nothing is
 * listening on the address we asked for. Covers both the Bun and the Node
 * shape, including the error nested under `cause`.
 */
export function isConnectionRefused(error: unknown): boolean {
  if (hasRefusedCode(error)) return true;
  return (
    typeof error === "object" &&
    error !== null &&
    "cause" in error &&
    hasRefusedCode(error.cause)
  );
}
