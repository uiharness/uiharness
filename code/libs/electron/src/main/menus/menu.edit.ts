import { MenuItemConstructorOptions } from 'electron';
import { IMenuContext } from './types';

/**
 * Current [edit] menu state.
 */
export function current(args: IMenuContext) {
  const menu: MenuItemConstructorOptions = {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  };

  return menu;
}
