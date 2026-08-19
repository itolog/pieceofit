import { KEY } from "./ansi.model";

/** Final byte of a CSI/SS3 sequence, per ECMA-48. */
const SEQUENCE_END = /[@-~]/u;

type SplitResult = {
  keys: string[];
  /** Trailing bytes that may still grow into a key; empty when `flush`. */
  pending: string;
};

/**
 * Splits raw-mode input into individual key presses.
 *
 * A `data` event is neither one key nor a whole one: typing, pasting and piped
 * input all arrive coalesced, an arrow key is three bytes, and the tty may cut
 * a sequence in half between two events. So a half-received sequence is handed
 * back as `pending` for the caller to prepend to the next chunk — otherwise
 * `ESC [` would be dropped and its `C` typed into the filter as a letter.
 *
 * `flush` resolves that ambiguity in the other direction: a lone `ESC` that
 * never grew into a sequence is the quit key, which is why the caller flushes
 * on a short timer rather than waiting forever.
 */
export const splitKeys = (input: string, flush = false): SplitResult => {
  const keys: string[] = [];
  const chars = [...input];

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];

    if (char !== KEY.escape) {
      if (char !== undefined) keys.push(char);

      continue;
    }

    const introducer = chars[index + 1];

    if (introducer === undefined) {
      if (!flush) return { keys, pending: KEY.escape };

      keys.push(KEY.escape);

      continue;
    }

    // A bare ESC (the quit key) is an ESC that starts no sequence.
    if (introducer !== "[" && introducer !== "O") {
      keys.push(KEY.escape);

      continue;
    }

    let end = index + 2;

    while (end < chars.length && !SEQUENCE_END.test(chars[end] ?? "")) {
      end += 1;
    }

    if (end >= chars.length) {
      if (!flush) return { keys, pending: chars.slice(index).join("") };

      // An unterminated sequence at flush time is noise, not a key.
      return { keys, pending: "" };
    }

    keys.push(chars.slice(index, end + 1).join(""));
    index = end;
  }

  return { keys, pending: "" };
};
