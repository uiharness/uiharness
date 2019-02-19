import { MenuItemConstructorOptions } from 'electron';
import { IContext } from '../types';

/**
 * Current [edit] menu state.
 */
export function current(args: IContext) {
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
