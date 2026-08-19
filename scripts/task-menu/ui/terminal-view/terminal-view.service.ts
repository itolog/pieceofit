import type { MenuAction, MenuModel, MenuView } from "../../task-menu.type";
import {
  ALT_SCREEN_OFF,
  ALT_SCREEN_ON,
  HIDE_CURSOR,
  SHOW_CURSOR,
} from "./ansi.model";
import { toMenuAction } from "./key-actions.util";
import { renderFrame } from "./render-frame.util";
import { splitKeys } from "./split-keys.util";

/** How long a half-received escape sequence waits for its tail. */
const PENDING_KEY_MS = 20;

const MAX_ROWS = 12;
/** Rows the chrome around the list needs: filter, spacers, hint, footer. */
const CHROME_ROWS = 6;

const visibleRows = (): number =>
  Math.max(3, Math.min(MAX_ROWS, (process.stdout.rows ?? 24) - CHROME_ROWS));

/**
 * The menu drawn as raw ANSI on the alternate screen, with raw-mode stdin for
 * input — one implementation of `MenuView`, and the only place in the menu that
 * knows a terminal exists.
 *
 * It deliberately depends on nothing: Ink was tried and reverted, because a
 * second copy of Ink at the repo root breaks the app's own Ink tests (see the
 * task-menu section in CLAUDE.md).
 *
 * @throws if stdin is not a TTY — there is no menu to show without one.
 */
export const createTerminalView = (): MenuView => {
  const { stdin, stdout } = process;

  if (!stdin.isTTY) {
    throw new Error("The task menu needs an interactive terminal.");
  }

  let query = "";
  let buffered = "";
  let flushTimer: ReturnType<typeof setTimeout> | undefined;
  let onData: ((chunk: Buffer) => void) | undefined;

  const emit = (handler: (action: MenuAction) => void, keys: string[]) => {
    for (const key of keys) {
      const action = toMenuAction(key, query);

      // The view owns the filter text; the menu is told the value, not the key.
      if (action?.type === "setQuery") query = action.value;

      if (action) handler(action);
    }
  };

  return {
    render(model: MenuModel) {
      query = model.query;
      stdout.write(renderFrame(model, visibleRows()));
    },

    onAction(handler) {
      onData = (chunk: Buffer) => {
        clearTimeout(flushTimer);

        const { keys, pending } = splitKeys(buffered + chunk.toString("utf8"));

        buffered = pending;
        emit(handler, keys);

        // A trailing ESC is ambiguous: the quit key, or the head of an arrow
        // key split across two `data` events. Waiting a beat tells them apart.
        if (buffered) {
          flushTimer = setTimeout(() => {
            const flushed = splitKeys(buffered, true);

            buffered = "";
            emit(handler, flushed.keys);
          }, PENDING_KEY_MS);
        }
      };

      stdout.write(`${ALT_SCREEN_ON}${HIDE_CURSOR}`);
      stdin.setRawMode(true);
      stdin.resume();
      stdin.on("data", onData);
    },

    close() {
      clearTimeout(flushTimer);

      if (onData) stdin.off("data", onData);

      stdin.setRawMode(false);
      stdin.pause();
      stdout.write(`${SHOW_CURSOR}${ALT_SCREEN_OFF}`);
    },
  };
};
