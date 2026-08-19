import {
  initialMenuState,
  reduceMenu,
  selectMenuModel,
} from "../core/menu-state";
import type { MenuContext, MenuView, Task } from "../task-menu.type";

/**
 * Drives one menu session: feeds the view a model, feeds the reducer the view's
 * actions, and resolves with the task the user picked (or `undefined` if they
 * quit). The view is closed either way.
 *
 * This is the only place that knows about both sides, and it knows each of them
 * only through its type — `core/` never imports a view, a view never imports
 * `core/`.
 */
export const pickTask = (
  view: MenuView,
  context: MenuContext,
  initialQuery: string,
): Promise<Task | undefined> =>
  new Promise<Task | undefined>((resolve) => {
    let state = initialMenuState(context, initialQuery);
    let settled = false;

    view.onAction((action) => {
      if (settled) return;

      const transition = reduceMenu(state, action, context);

      state = transition.state;

      if (transition.done) {
        settled = true;
        view.close();
        resolve(transition.selected);

        return;
      }

      view.render(selectMenuModel(state, context));
    });

    view.render(selectMenuModel(state, context));
  });
