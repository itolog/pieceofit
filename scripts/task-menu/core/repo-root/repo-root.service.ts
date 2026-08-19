import { dirname, join, resolve } from "node:path";

import { readPackageJson, workspacePatterns } from "../package-json";

/**
 * Walks up from `startDir` to the first `package.json` that declares
 * `workspaces` — the monorepo root.
 *
 * The root is found at runtime rather than derived from `import.meta.url`
 * because the compiled binary's own path is inside Bun's virtual filesystem
 * (`/$bunfs/…`), which says nothing about where the repo is. Walking up from the
 * working directory also means `./menu` works from any subdirectory.
 */
export const findRepoRoot = async (
  startDir: string,
): Promise<string | undefined> => {
  let current = resolve(startDir);

  for (;;) {
    const packageJson = await readPackageJson(join(current, "package.json"));

    if (packageJson && workspacePatterns(packageJson).length > 0) {
      return current;
    }

    const parent = dirname(current);

    if (parent === current) return undefined;

    current = parent;
  }
};
