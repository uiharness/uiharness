import { MenuItemConstructorOptions, shell } from 'electron';
import { IMenuContext } from './types';

/**
 * Current [window] menu state.
 */
export function current(args: IMenuContext) {
  const menu: MenuItemConstructorOptions = {
    role: 'window',
    submenu: [
      { role: 'close' },
      { role: 'minimize' },
      { type: 'separator' },
      { role: 'front' },
    ],
  };

  return menu;
}
