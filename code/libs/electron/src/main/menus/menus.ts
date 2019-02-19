import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import * as about from './menu.about';
import * as edit from './menu.edit';
import * as help from './menu.help';
import * as view from './menu.view';
import * as window from './menu.window';
import * as t from './types';

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

  const getTemplate = () => {
    const template: MenuItemConstructorOptions[] = [
      edit.current(context),
      view.current(context),
      window.current({ ...context, newWindow }),
      help.current(context),
    ];

    if (process.platform === 'darwin') {
      template.unshift(about.current(context));
    }

    return template;
  };

  // Redraw menus on change.
  const syncMenu = () => {
    const menu = Menu.buildFromTemplate(getTemplate());
    Menu.setApplicationMenu(menu);
  };
  syncMenu();
  changed$.pipe(debounceTime(0)).subscribe(syncMenu);

  // Finish up.
  return {
    stop,
    get current() {
      return getTemplate();
    },
  };
}
