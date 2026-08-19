import type { Task } from "../../task-menu.type";

/**
 * Whitespace-separated tokens, each of which must appear somewhere in the
 * workspace name, the script name or the script body — so `test unit` and
 * `translator vitest` both narrow to the same handful of entries.
 */
export const filterTasks = (tasks: Task[], query: string): Task[] => {
  const tokens = query.toLowerCase().split(/\s+/u).filter(Boolean);

  if (tokens.length === 0) return tasks;

  return tasks.filter((task) => {
    const haystack =
      `${task.workspace} ${task.script} ${task.command}`.toLowerCase();

    return tokens.every((token) => haystack.includes(token));
  });
};
