import { collectTasks } from "./core/collect-tasks";
import { findRepoRoot } from "./core/repo-root";
import { runTask } from "./core/run-task";
import { readRecentTasks, rememberTask } from "./core/task-history";
import { pickTask } from "./pick-task";
import type { MenuView } from "./task-menu.type";

type RunMenuOptions = {
  /** Constructed lazily, so a failing view doesn't cost a task scan. */
  createView: () => MenuView;
  /** Directory the repo is looked up from. */
  cwd: string;
  /** Filter the menu opens with, from the command line. */
  initialQuery: string;
};

/**
 * The whole use case, start to finish: find the repo, collect its scripts, let
 * the user pick one, remember it, run it.
 *
 * @returns the exit code to leave the process with.
 */
export const runMenu = async ({
  createView,
  cwd,
  initialQuery,
}: RunMenuOptions): Promise<number> => {
  const rootDir = await findRepoRoot(cwd);

  if (!rootDir) {
    console.error("No workspace root above the current directory.");

    return 1;
  }

  const tasks = await collectTasks(rootDir);

  if (tasks.length === 0) {
    console.error(`No scripts declared in ${rootDir}.`);

    return 1;
  }

  const recent = await readRecentTasks(rootDir, tasks);
  const task = await pickTask(createView(), { tasks, recent }, initialQuery);

  if (!task) return 0;

  await rememberTask(rootDir, task);
  console.log(`\n❯ ${task.workspace} › ${task.script}\n`);

  return await runTask(task);
};
