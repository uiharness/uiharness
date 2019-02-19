import { MenuItemConstructorOptions } from 'electron';
import * as t from './types';

/**
 * Current [window] menu state.
 */
export function current(
  args: t.IMenuContext & { newWindow: t.NewWindowFactory },
) {
  const { newWindow } = args;
  const menu: MenuItemConstructorOptions = {
    role: 'window',
    submenu: [
      { label: 'New Window', click: () => newWindow() },
      { role: 'close' },
      { role: 'minimize' },
      { type: 'separator' },
      { role: 'front' },
    ],
  };

  return menu;
}
