import main from '@platform/electron/lib/main';
import { MenuItemConstructorOptions, BrowserWindow } from 'electron';
import { filter } from 'rxjs/operators';

import { TAG } from '../../common';
import * as t from './types';

/**
 * Current [window] menu state.
 */
export function current(
  args: t.IMenuContext & {
    newWindow: t.NewWindowFactory;
    include: main.IWindowTag[];
  },
) {
  type MenuItem = MenuItemConstructorOptions;
  const { newWindow, windows, include = [] } = args;

  // Monitor changes.
  windows.change$
    .pipe(filter(e => ['CREATED', 'CLOSED', 'FOCUS'].includes(e.type)))
    .subscribe(() => args.changed$.next());

  // Build list of active windows.
  const refs = windows.byTag(...include);
  const all = BrowserWindow.getAllWindows();

  const isDevTools = (id: number) => {
    return windows
      .byTag(TAG.DEV_TOOLS.key, TAG.DEV_TOOLS.value)
      .some(ref => ref.id === id);
  };

  const getChildDevToolsId = (id: number) => {
    const window = all.find(window => window.id === id);
    const children = window ? window.getChildWindows() : [];
    const devTools = children.find(window => isDevTools(window.id));
    return devTools ? devTools.id : undefined;
  };

  const isFocused = (id: number) => {
    const focused = BrowserWindow.getFocusedWindow();
    const focusId = focused ? focused.id : undefined;
    return focusId === id || focusId === getChildDevToolsId(id);
  };

  const list = refs
    .map(ref => {
      const window = all.find(window => window.id === ref.id);
      const label = window ? window.getTitle() : '';
      const checked = isFocused(ref.id);
      const item: MenuItem = { label, checked, type: 'checkbox' };
      return item;
    })
    .filter(({ label }) => Boolean(label));

  // Construct the menu.
  const menu: MenuItem = {
    label: 'Window',
    submenu: [
      { label: 'New Window', click: () => newWindow() },
      { role: 'close' },
      { role: 'minimize' },
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
      ...list,
    ],
  };

  // Finish up.
  return menu;
}
