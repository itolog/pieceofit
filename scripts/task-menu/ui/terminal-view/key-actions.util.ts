import type { MenuAction } from "../../task-menu.type";
import { KEY } from "./ansi.model";

// Escape sequences arrive whole, so anything starting with ESC that the key map
// doesn't know (page-up, mouse reports…) is dropped rather than typed into the
// filter.
const isPrintable = (key: string): boolean =>
  !key.startsWith(KEY.escape) &&
  [...key].every((char) => char >= " " && char !== KEY.backspace);

/**
 * Translates one key press into a menu action — the whole of this view's
 * opinion about the keyboard. `query` is needed because editing the filter text
 * belongs to the view: the menu is told the new value, not the keystroke.
 *
 * @returns the action, or `undefined` for a key with no meaning here.
 */
export const toMenuAction = (
  key: string,
  query: string,
): MenuAction | undefined => {
  switch (key) {
    case KEY.ctrlC:
    case KEY.escape:
      return { type: "quit" };

    case KEY.enter:
    case KEY.enterAlt:
      return { type: "submit" };

    case KEY.up:
      return { type: "move", delta: -1 };

    case KEY.down:
      return { type: "move", delta: 1 };

    case KEY.right:
      return { type: "open" };

    case KEY.left:
      return { type: "close" };

    case KEY.backspace:
    case KEY.backspaceAlt:
      return { type: "setQuery", value: query.slice(0, -1) };

    case KEY.ctrlU:
      return { type: "setQuery", value: "" };

    default:
      return isPrintable(key)
        ? { type: "setQuery", value: query + key }
        : undefined;
  }
};
