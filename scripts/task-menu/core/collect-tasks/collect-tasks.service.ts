import { dirname, join, relative } from "node:path";

import { Glob } from "bun";

import type { Task } from "../../task-menu.type";
import {
  type PackageJson,
  readPackageJson,
  workspacePatterns,
} from "../package-json";

/** Label the root's own scripts are grouped under. */
const ROOT_LABEL = "root";

const toTasks = (
  packageJson: PackageJson,
  workspace: string,
  cwd: string,
): Task[] =>
  Object.entries(packageJson.scripts ?? {}).map(([script, command]) => ({
    workspace,
    script,
    command,
    cwd,
  }));

/**
 * Every script declared in the repo, root first and workspaces after it in
 * alphabetical order; within a workspace the scripts keep their `package.json`
 * order, which is the order they were written in.
 *
 * The workspace globs come from the root `package.json` rather than a hardcoded
 * list, so a new `apps/*` package shows up here the moment it is created.
 */
export const collectTasks = async (rootDir: string): Promise<Task[]> => {
  const rootPackageJson = await readPackageJson(join(rootDir, "package.json"));

  if (!rootPackageJson) return [];

  const workspaceTasks: Task[] = [];

  for (const pattern of workspacePatterns(rootPackageJson)) {
    const matches = new Glob(`${pattern}/package.json`).scan({ cwd: rootDir });

    for await (const match of matches) {
      const cwd = join(rootDir, dirname(match));
      const packageJson = await readPackageJson(join(cwd, "package.json"));

      if (!packageJson) continue;

      workspaceTasks.push(
        ...toTasks(
          packageJson,
          packageJson.name ?? relative(rootDir, cwd),
          cwd,
        ),
      );
    }
  }

  workspaceTasks.sort((left, right) =>
    left.workspace.localeCompare(right.workspace),
  );

  return [...toTasks(rootPackageJson, ROOT_LABEL, rootDir), ...workspaceTasks];
};
