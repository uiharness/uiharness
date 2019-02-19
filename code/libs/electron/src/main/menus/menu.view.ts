import main from '@platform/electron/lib/main';

import { MenuItemConstructorOptions, BrowserWindow } from 'electron';
import * as t from './types';
import { TAG } from '../../common';

/**
 * Current [view] menu state.
 */
export function current(args: t.IMenuContext) {
  const { windows } = args;

  const allDevToolsVisible = (isVisible: boolean) => {
    windows
      .byTag(TAG.DEV_TOOLS.key, TAG.DEV_TOOLS.value)
      .forEach(ref => setWindowVisibility(ref.id, isVisible));
  };

  const menu: MenuItemConstructorOptions = {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { type: 'separator' },
      {
        label: 'Show All Developer Tools',
        click: () => allDevToolsVisible(true),
      },
      {
        label: 'Hide All Developer Tools',
        click: () => allDevToolsVisible(false),
      },
    ],
  };

  return menu;
}

/**
 * INTERNAL
 */
const getWindow = (id: number) =>
  BrowserWindow.getAllWindows().find(window => window.id === id);

const setWindowVisibility = (id: number, isVisible: boolean) => {
  const window = getWindow(id);
  if (window) {
    if (isVisible) {
      window.show();
    } else {
      window.hide();
    }
  }
};
