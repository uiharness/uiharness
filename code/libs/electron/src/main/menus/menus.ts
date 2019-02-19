import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import * as about from './menu.about';
import * as edit from './menu.edit';
import * as help from './menu.help';
import * as view from './menu.view';
import * as window from './menu.window';
import * as t from './types';
import { TAG } from '../../common';

/**
 * Handles the creation of menus.
 */
export function manage(args: t.IContext & { newWindow: t.NewWindowFactory }) {
  const { config, id, store, log, ipc, windows, newWindow } = args;

  const changed$ = new Subject();
  const stop = () => changed$.complete();
  app.once('quit', () => stop());

  const context: t.IMenuContext = {
    config,
    id,
    store,
    log,
    ipc,
    windows,
    changed$,
  };

  const template = () => {
    const result: MenuItemConstructorOptions[] = [
      edit.current(context),
      view.current(context),
      window.current({
        ...context,
        newWindow,
        include: [{ tag: TAG.WINDOW.key, value: TAG.WINDOW.value }],
      }),
      help.current(context),
    ];

    if (process.platform === 'darwin') {
      result.unshift(about.current(context));
    }

    return result;
  };

  // Redraw menus on change.
  const menu = () => Menu.buildFromTemplate(template());
  const sync = () => Menu.setApplicationMenu(menu());
  changed$.pipe(debounceTime(0)).subscribe(sync);
  sync();

  // Finish up.
  return {
    stop,
    sync,
    get template() {
      return template();
    },
    get menu() {
      return menu();
    },
  };
}
