import type {
  MenuAction,
  MenuContext,
  MenuModel,
  MenuState,
  Task,
} from "../../task-menu.type";
import {
  buildRows,
  firstTaskRow,
  isFiltering,
  RECENT_LABEL,
} from "../menu-rows";

/** The outcome of one action: the next state, and whether the menu is done. */
export type MenuTransition = {
  state: MenuState;
  /** Set when the user picked a task to run. */
  selected?: Task;
  /** Set when the menu should close, with or without a selection. */
  done?: boolean;
};

/**
 * Sections start collapsed, except `recent` — repeating the last run is the
 * reason to open the menu at all, so its newest entry is where the cursor
 * starts and Enter is enough to run it again.
 */
export const initialMenuState = (
  context: MenuContext,
  query: string,
): MenuState => {
  const state: MenuState = {
    query,
    cursor: 0,
    expanded: new Set([RECENT_LABEL]),
  };

  return { ...state, cursor: firstTaskRow(buildRows(state, context).rows) };
};

const withExpanded = (
  state: MenuState,
  change: (expanded: Set<string>) => void,
): ReadonlySet<string> => {
  const expanded = new Set(state.expanded);

  change(expanded);

  return expanded;
};

/** Collapses `label` and parks the cursor on that section's header. */
const collapse = (
  state: MenuState,
  context: MenuContext,
  label: string,
): MenuState => {
  const expanded = withExpanded(state, (next) => next.delete(label));
  const collapsed = { ...state, expanded };
  const header = buildRows(collapsed, context).rows.findIndex(
    (row) => row.kind === "header" && row.label === label,
  );

  return { ...collapsed, cursor: header === -1 ? state.cursor : header };
};

/**
 * Every rule about what the menu does lives here: which rows the cursor visits,
 * what Enter means on a header versus a task, when folding is allowed. A view
 * only translates its input into a `MenuAction`, which is what makes swapping
 * the view a swap of drawing and key mapping, nothing else.
 */
export const reduceMenu = (
  state: MenuState,
  action: MenuAction,
  context: MenuContext,
): MenuTransition => {
  const { rows } = buildRows(state, context);
  // A section can shrink under the cursor (a collapse, a narrower filter).
  const cursor = Math.min(state.cursor, Math.max(rows.length - 1, 0));
  const row = rows[cursor];
  // While filtering, every matching section is open by definition, so
  // collapsing one would be undone on the next keystroke.
  const foldable = !isFiltering(state);

  switch (action.type) {
    case "quit":
      return { state, done: true };

    case "move": {
      if (rows.length === 0) return { state };

      const next = (cursor + action.delta + rows.length) % rows.length;

      return { state: { ...state, cursor: next } };
    }

    case "setQuery": {
      const queried = { ...state, query: action.value };

      return {
        state: {
          ...queried,
          cursor: firstTaskRow(buildRows(queried, context).rows),
        },
      };
    }

    case "open": {
      if (!foldable || row?.kind !== "header" || row.expanded) {
        return { state: { ...state, cursor } };
      }

      return {
        state: {
          ...state,
          expanded: withExpanded(state, (next) => next.add(row.label)),
          // Step into the section that just opened.
          cursor: cursor + 1,
        },
      };
    }

    case "close": {
      if (!foldable || !row) return { state: { ...state, cursor } };

      if (row.kind === "task") {
        return { state: collapse({ ...state, cursor }, context, row.section) };
      }

      return row.expanded
        ? { state: collapse({ ...state, cursor }, context, row.label) }
        : { state: { ...state, cursor } };
    }

    case "submit": {
      if (row?.kind === "task") {
        return { state: { ...state, cursor }, selected: row.task, done: true };
      }

      if (row?.kind !== "header" || !foldable) {
        return { state: { ...state, cursor } };
      }

      return row.expanded
        ? { state: collapse({ ...state, cursor }, context, row.label) }
        : {
            state: {
              ...state,
              expanded: withExpanded(state, (next) => next.add(row.label)),
              cursor: cursor + 1,
            },
          };
    }
  }
};

/** Everything a view needs to draw the current state, and nothing more. */
export const selectMenuModel = (
  state: MenuState,
  context: MenuContext,
): MenuModel => {
  const { rows, shown } = buildRows(state, context);

  return {
    rows,
    cursor: Math.min(state.cursor, Math.max(rows.length - 1, 0)),
    query: state.query,
    shown,
    total: context.tasks.length,
    filtering: isFiltering(state),
  };
};
