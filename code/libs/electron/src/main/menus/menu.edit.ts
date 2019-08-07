import { MenuItemConstructorOptions } from 'electron';
import * as t from './types';

/**
 * Current [edit] menu state.
 */
export function current(args: t.IMenuContext) {
  const menu: MenuItemConstructorOptions = {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' },
    ],
  };

  return menu;
}
