import { join } from "node:path";

import type { Task } from "../../task-menu.type";

/** How many past runs the menu offers as shortcuts. */
const MAX_HISTORY = 5;

/**
 * Kept under `node_modules/`, not in the repo: it is per-checkout state, it is
 * already git-ignored, and `deps:reinstall` wiping it costs nothing.
 */
const historyFile = (rootDir: string): string =>
  join(rootDir, "node_modules", ".cache", "task-menu", "history.json");

type HistoryEntry = {
  workspace: string;
  script: string;
};

const isEntry = (value: unknown): value is HistoryEntry =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as HistoryEntry).workspace === "string" &&
  typeof (value as HistoryEntry).script === "string";

const sameTask = (entry: HistoryEntry, task: Task): boolean =>
  entry.workspace === task.workspace && entry.script === task.script;

const readEntries = async (rootDir: string): Promise<HistoryEntry[]> => {
  try {
    const handle = Bun.file(historyFile(rootDir));

    if (!(await handle.exists())) return [];

    const parsed: unknown = await handle.json();

    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    // A corrupt or half-written history is not worth failing the menu over.
    return [];
  }
};

/**
 * The most recently run tasks, newest first, resolved against the tasks that
 * exist right now — a script that was renamed or removed drops out silently.
 */
export const readRecentTasks = async (
  rootDir: string,
  tasks: Task[],
): Promise<Task[]> => {
  const entries = await readEntries(rootDir);

  return entries
    .map((entry) => tasks.find((task) => sameTask(entry, task)))
    .filter((task): task is Task => task !== undefined);
};

/** Moves `task` to the front of the history, keeping it at `MAX_HISTORY`. */
export const rememberTask = async (
  rootDir: string,
  task: Task,
): Promise<void> => {
  const entries = await readEntries(rootDir);
  const next = [
    { workspace: task.workspace, script: task.script },
    ...entries.filter((entry) => !sameTask(entry, task)),
  ].slice(0, MAX_HISTORY);

  try {
    await Bun.write(historyFile(rootDir), JSON.stringify(next, null, 2));
  } catch {
    // History is a convenience; a read-only checkout still gets a usable menu.
  }
};
