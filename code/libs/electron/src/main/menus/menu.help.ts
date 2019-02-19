import { MenuItemConstructorOptions, shell } from 'electron';
import { IContext } from '../types';

/**
 * Current [help] menu state.
 */
export function current(args: IContext) {
  const menu: MenuItemConstructorOptions = {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => shell.openExternal('https://uiharness.com'),
      },
    ],
  };

  return menu;
}
