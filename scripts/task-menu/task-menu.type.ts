/** A single runnable script, resolved to the workspace that declares it. */
export type Task = {
  /** Display name: the package name, or `root` for the repo root. */
  workspace: string;
  /** Script name as declared in `scripts`. */
  script: string;
  /** The script body, shown as a hint and matched by the filter. */
  command: string;
  /** Absolute directory the script has to run in. */
  cwd: string;
};

/**
 * One printed line, and one cursor stop: headers are selectable too, since
 * that is what expanding a section acts on.
 */
export type Row =
  | { kind: "header"; label: string; count: number; expanded: boolean }
  | {
      kind: "task";
      task: Task;
      /** The section this row folds back into, for `close` on a task. */
      section: string;
      /** Recent entries come from several workspaces, so they carry the name. */
      withWorkspace: boolean;
    };

/** Everything the menu is, between two key presses. */
export type MenuState = {
  query: string;
  /** Index into the rows the current state produces. */
  cursor: number;
  /** Labels of the open sections; ignored while a filter is active. */
  expanded: ReadonlySet<string>;
};

/** The task list a state is interpreted against. */
export type MenuContext = {
  tasks: Task[];
  recent: Task[];
};

/**
 * What a view reports, in the menu's own vocabulary — never key codes. A view
 * decides that `→` means `open`; what `open` does is not its business.
 */
export type MenuAction =
  | { type: "move"; delta: number }
  | { type: "open" }
  | { type: "close" }
  | { type: "submit" }
  | { type: "setQuery"; value: string }
  | { type: "quit" };

/** Everything a view needs to draw a frame, and nothing more. */
export type MenuModel = {
  rows: Row[];
  cursor: number;
  query: string;
  /** Tasks the filter kept, for the counter. */
  shown: number;
  /** Tasks in the repo, for the counter. */
  total: number;
  /** Whether the filter is what is holding sections open. */
  filtering: boolean;
};

/**
 * The port a UI implements. `terminal-view` is one implementation (raw stdin +
 * ANSI); a different toolkit is a second one, and nothing outside `ui/` has to
 * change to swap them — the entry point picks which is constructed.
 */
export type MenuView = {
  /** Draws a frame. Called once at start-up and after every action. */
  render: (model: MenuModel) => void;
  /** Registers the action stream. Called once, before the first render. */
  onAction: (handler: (action: MenuAction) => void) => void;
  /** Gives the terminal (raw mode, alternate screen, …) back. */
  close: () => void;
};
