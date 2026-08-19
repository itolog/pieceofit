import type { MenuModel, Row } from "../../task-menu.type";
import {
  BOLD,
  CLEAR_SCREEN,
  CLOSED_MARK,
  CYAN,
  DIM,
  INVERSE,
  OPEN_MARK,
  RESET,
} from "./ansi.model";

/** First visible row, chosen so the cursor stays on screen and near the middle. */
const windowStart = (
  rowCount: number,
  cursor: number,
  height: number,
): number =>
  rowCount <= height
    ? 0
    : Math.min(Math.max(cursor - Math.floor(height / 2), 0), rowCount - height);

/**
 * The header of the section `start` falls inside, so a scrolled list still says
 * which package its rows belong to. Costs the topmost task row — skipped when
 * that row is the cursor's, which only happens at the very end of the list.
 */
const stickyHeader = (rows: Row[], start: number, cursor: number): Row[] => {
  const first = rows[start];

  if (start === 0 || first?.kind !== "task" || start === cursor) {
    return rows.slice(start);
  }

  const header = rows.findLast(
    (row, index) => index < start && row.kind === "header",
  );

  return header ? [header, ...rows.slice(start + 1)] : rows.slice(start);
};

const renderRow = (
  row: Row,
  isActive: boolean,
  labelWidth: number,
  taskLabelWidth: number,
): string => {
  const marker = isActive ? `${CYAN}❯ ${RESET}` : "  ";

  if (row.kind === "header") {
    const mark = row.expanded ? OPEN_MARK : CLOSED_MARK;
    const name = row.label.padEnd(labelWidth);
    const color = isActive ? CYAN : "";

    return `${marker}${color}${mark} ${BOLD}${name}${RESET}${DIM} ${row.count}${RESET}`;
  }

  const { task } = row;
  const prefix = row.withWorkspace
    ? `${task.workspace.padEnd(taskLabelWidth)}${DIM} › ${RESET}`
    : "";

  return isActive
    ? `${marker}  ${prefix}${BOLD}${CYAN}${task.script}${RESET}`
    : `${marker}  ${DIM}${prefix}${RESET}${task.script}`;
};

/**
 * A whole frame, ANSI escapes included — pure, so the layout can be checked
 * without a terminal. Lines end in `\r\n`: raw mode does not translate a bare
 * newline into a carriage return.
 */
export const renderFrame = (model: MenuModel, height: number): string => {
  const { rows, cursor, query, shown, total, filtering } = model;
  const start = windowStart(rows.length, cursor, height);
  const visible = stickyHeader(rows, start, cursor).slice(0, height);
  const active = rows[cursor];

  const labelWidth = Math.max(
    0,
    ...rows.map((row) => (row.kind === "header" ? row.label.length : 0)),
  );
  const taskLabelWidth = Math.max(
    0,
    ...rows.map((row) =>
      row.kind === "task" && row.withWorkspace ? row.task.workspace.length : 0,
    ),
  );

  const hint =
    active?.kind === "task"
      ? `${active.task.workspace} › ${active.task.command}`
      : "";

  const keys = filtering
    ? "↑↓ move · Enter run · Ctrl+U clear · Esc quit"
    : "↑↓ move · →/Enter open · ← close · Enter run · Esc quit";

  const lines = [
    `${CYAN}filter${RESET} ${query}${INVERSE} ${RESET}`,
    "",
    ...(visible.length === 0
      ? [`${DIM}    no matching script${RESET}`]
      : visible.map((row) =>
          renderRow(
            row,
            // Compare by identity: a sticky header is not at its own index.
            row === rows[cursor],
            labelWidth,
            taskLabelWidth,
          ),
        )),
    "",
    `${DIM}  ${hint}${RESET}`,
    `${DIM}  ${keys} · ${shown}/${total}${RESET}`,
  ];

  return `${CLEAR_SCREEN}${lines.join("\r\n")}`;
};
