export type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  workspaces?: string[] | { packages?: string[] };
};

/** Parsed `package.json`, or `undefined` if it is missing or unreadable. */
export const readPackageJson = async (
  file: string,
): Promise<PackageJson | undefined> => {
  try {
    const handle = Bun.file(file);

    return (await handle.exists())
      ? ((await handle.json()) as PackageJson)
      : undefined;
  } catch {
    return undefined;
  }
};

/** Workspace globs, from either the array or the `{ packages }` object form. */
export const workspacePatterns = (packageJson: PackageJson): string[] =>
  Array.isArray(packageJson.workspaces)
    ? packageJson.workspaces
    : (packageJson.workspaces?.packages ?? []);
