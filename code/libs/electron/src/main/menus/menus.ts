import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  takeUntil,
  take,
  takeWhile,
  map,
  filter,
  share,
  delay,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/operators';

import { Menu, MenuItemConstructorOptions, app } from 'electron';

import * as t from './types';
import * as about from './menu.about';
import * as edit from './menu.edit';
import * as help from './menu.help';
import * as view from './menu.view';
import * as window from './menu.window';

/**
 * Handles the creation of menus.
 */
export function manage(args: t.IContext & { newWindow: t.NewWindowFactory }) {
  const { config, id, store, log, ipc, windows, newWindow } = args;

  const dispose$ = new Subject();
  const changed$ = new Subject();

  app.once('quit', () => dispose$.next());

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

  const syncMenu = () => {
    console.log('-------------------------------------------');
    console.log('sync menu');
    const menu = Menu.buildFromTemplate(getTemplate());
    Menu.setApplicationMenu(menu);
  };

  // Redraw menus on change.
  changed$
    .pipe(
      takeUntil(dispose$),
      debounceTime(0),
    )
    .subscribe(() => syncMenu());

  // Finish up.
  syncMenu();
}
