const ESC = "\u001B";

/** Text styling. */
export const RESET = `${ESC}[0m`;
export const DIM = `${ESC}[2m`;
export const BOLD = `${ESC}[1m`;
export const CYAN = `${ESC}[36m`;
export const INVERSE = `${ESC}[7m`;

/** Screen control. */
export const CLEAR_SCREEN = `${ESC}[H${ESC}[2J`;
export const ALT_SCREEN_ON = `${ESC}[?1049h`;
export const ALT_SCREEN_OFF = `${ESC}[?1049l`;
export const HIDE_CURSOR = `${ESC}[?25l`;
export const SHOW_CURSOR = `${ESC}[?25h`;

/** Input, as the terminal delivers it. */
export const KEY = {
  ctrlC: "\u0003",
  ctrlU: "\u0015",
  escape: ESC,
  up: `${ESC}[A`,
  down: `${ESC}[B`,
  right: `${ESC}[C`,
  left: `${ESC}[D`,
  backspace: "\u007F",
  backspaceAlt: "\b",
  enter: "\r",
  enterAlt: "\n",
} as const;

/** Section markers. */
export const OPEN_MARK = "▾";
export const CLOSED_MARK = "▸";
