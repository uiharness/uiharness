import { BrowserWindow, MenuItemConstructorOptions } from 'electron';
import * as t from './types';

/**
 * Current [view] menu state.
 */
export function current(args: t.IMenuContext) {
  const menu: MenuItemConstructorOptions = {
    label: 'View',
    submenu: [{ role: 'reload' }, { role: 'forceReload' }, { type: 'separator' }],
  };
  return menu;
}

/**
 * [INTERNAL]
 */
const getWindow = (id: number) => BrowserWindow.getAllWindows().find(window => window.id === id);
