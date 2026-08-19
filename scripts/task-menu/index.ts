// The module's public surface: one use case, and one view to run it with.
// Everything else — the domain types, the reducer, the row builder — is
// internal, and its consumers import it by path inside `task-menu/`.
export { runMenu } from "./run-menu.service";
export { createTerminalView } from "./ui/terminal-view";
