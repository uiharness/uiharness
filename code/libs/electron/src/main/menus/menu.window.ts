import { MenuItemConstructorOptions, shell } from 'electron';
import { IContext } from '../types';

/**
 * Current [window] menu state.
 */
export function current(args: IContext) {
  const menu: MenuItemConstructorOptions = {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }],
  };

  menu.submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' },
  ];

  return menu;
}
