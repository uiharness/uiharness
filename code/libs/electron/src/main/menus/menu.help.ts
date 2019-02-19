import { MenuItemConstructorOptions, shell } from 'electron';
import * as t from './types';

/**
 * Current [help] menu state.
 */
export function current(args: t.IMenuContext) {
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
