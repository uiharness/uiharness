import { MenuItemConstructorOptions } from 'electron';

import { IMenuContext } from './types';

/**
 * Current [app] menu state (OSX).
 */
export function current(args: IMenuContext) {
  const { config } = args;
  const menu: MenuItemConstructorOptions = {
    label: config.name,
    submenu: [
      // { role: 'about' },
      // { label: 'About UIHarness' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  };

  return menu;
}
