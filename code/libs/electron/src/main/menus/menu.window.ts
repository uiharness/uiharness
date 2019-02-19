import { MenuItemConstructorOptions } from 'electron';
import { filter } from 'rxjs/operators';

import { TAG } from '../../common';
import * as t from './types';

/**
 * Current [window] menu state.
 */
export function current(
  args: t.IMenuContext & { newWindow: t.NewWindowFactory },
) {
  const { newWindow, windows } = args;
  const menu: MenuItemConstructorOptions = {
    label: 'Window',
    submenu: [
      { label: 'New Window', click: () => newWindow() },
      { role: 'close' },
      { role: 'minimize' },
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
    ],
  };

  const refs = windows.byTag(TAG.WINDOW.key, TAG.WINDOW.value);

  windows.change$
    .pipe(filter(e => e.type === 'CREATED' || e.type === 'CLOSED'))
    .subscribe(() => args.changed$.next());

  return menu;
}
