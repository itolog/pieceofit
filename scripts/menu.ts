#!/usr/bin/env bun

/**
 * Entry point of the task menu (`bun run menu`, or the compiled `./menu`).
 *
 * It is a composition root and nothing else: it picks the view implementation,
 * passes the process's arguments in, and turns the result into an exit code.
 * Swapping the terminal view for another toolkit is a change to this one line.
 */
import { createTerminalView, runMenu } from "./task-menu";

process.exit(
  await runMenu({
    createView: createTerminalView,
    cwd: process.cwd(),
    initialQuery: process.argv.slice(2).join(" "),
  }),
);
