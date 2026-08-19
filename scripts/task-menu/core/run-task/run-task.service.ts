import type { Task } from "../../task-menu.type";

/**
 * Runs the script and resolves with its exit code.
 *
 * The script runs as `bun run <script>` with `cwd` set to its workspace, **not**
 * through `bun run --filter`: the filtered form prefixes and buffers the child's
 * output, which breaks anything interactive (`dev` is an Ink app, `deps:update`
 * prompts).
 */
export const runTask = async (task: Task): Promise<number> => {
  const child = Bun.spawn(["bun", "run", task.script], {
    cwd: task.cwd,
    stdio: ["inherit", "inherit", "inherit"],
  });

  return await child.exited;
};
