import type { MenuContext, MenuState, Row, Task } from "../../task-menu.type";
import { filterTasks } from "../filter-tasks";

/** Label of the section holding the last runs. */
export const RECENT_LABEL = "recent";

type Section = {
  label: string;
  tasks: Task[];
  withWorkspace: boolean;
};

/** Groups tasks by workspace, keeping the order they were collected in. */
const byWorkspace = (tasks: Task[]): Section[] => {
  const sections = new Map<string, Task[]>();

  for (const task of tasks) {
    const existing = sections.get(task.workspace);

    if (existing) existing.push(task);
    else sections.set(task.workspace, [task]);
  }

  return [...sections].map(([label, grouped]) => ({
    label,
    tasks: grouped,
    withWorkspace: false,
  }));
};

/**
 * The rows a state produces, and how many tasks the filter kept.
 *
 * Sections are collapsed by default — with several apps the flat list is a wall
 * of names — and a filter overrides that: while you type, every section holding
 * a match is open, because a hit you cannot see is the same as no hit. The
 * `expanded` set is therefore consulted only on an empty filter.
 */
export const buildRows = (
  state: MenuState,
  { tasks, recent }: MenuContext,
): { rows: Row[]; shown: number } => {
  const filtered = filterTasks(tasks, state.query);
  const filtering = isFiltering(state);

  const sections: Section[] = [
    ...(filtering || recent.length === 0
      ? []
      : [{ label: RECENT_LABEL, tasks: recent, withWorkspace: true }]),
    ...byWorkspace(filtered),
  ];

  const rows: Row[] = [];

  for (const section of sections) {
    const open = filtering || state.expanded.has(section.label);

    rows.push({
      kind: "header",
      label: section.label,
      count: section.tasks.length,
      expanded: open,
    });

    if (!open) continue;

    for (const task of section.tasks) {
      rows.push({
        kind: "task",
        task,
        section: section.label,
        withWorkspace: section.withWorkspace,
      });
    }
  }

  return { rows, shown: filtered.length };
};

/** Whether the filter, rather than `expanded`, decides what is open. */
export const isFiltering = (state: MenuState): boolean =>
  state.query.trim().length > 0;

/** Row index of the first task, or of the first row when there is none. */
export const firstTaskRow = (rows: Row[]): number => {
  const index = rows.findIndex((row) => row.kind === "task");

  return index === -1 ? 0 : index;
};
