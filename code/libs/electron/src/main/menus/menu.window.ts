import main from '@platform/electron/lib/main';
import { BrowserWindow, MenuItemConstructorOptions } from 'electron';
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

  // Monitor for changes that require a redraw of the menu.
  windows.change$
    .pipe(filter(e => ['CREATED', 'CLOSED', 'FOCUS'].includes(e.type)))
    .subscribe(() => args.changed$.next());

  // Build list of active windows.
  const refs = windows.byTag(...include);
  const all = BrowserWindow.getAllWindows();

  const getWindow = (id: number) => all.find(window => window.id === id);

  const isDevTools = (id: number) => {
    return windows
      .byTag(TAG.DEV_TOOLS.key, TAG.DEV_TOOLS.value)
      .some(ref => ref.id === id);
  };

  const getChildDevToolsId = (id: number) => {
    const window = getWindow(id);
    const children = window ? window.getChildWindows() : [];
    const devTools = children.find(window => isDevTools(window.id));
    return devTools ? devTools.id : undefined;
  };

  const isFocused = (id: number) => {
    const focused = BrowserWindow.getFocusedWindow();
    const focusId = focused ? focused.id : undefined;
    return focusId === id || focusId === getChildDevToolsId(id);
  };

  const selectWindowHandler = (id: number) => () => {
    const window = getWindow(id);
    if (window) {
      window.show();
    }
  };

  const windowsList = refs
    .map(ref => {
      const window = getWindow(ref.id);
      const label = window ? window.getTitle() : '';
      const item: MenuItem = {
        label,
        type: 'checkbox',
        checked: isFocused(ref.id),
        click: selectWindowHandler(ref.id),
      };
      return item;
    })
    .filter(({ label }) => Boolean(label))
    .map((item, i) => {
      // Append index numbers when more than one UIHarness window.
      // NB: This is to avoid a list of window names all the same.
      return refs.length > 1
        ? { ...item, label: `${i + 1}. ${item.label}` }
        : item;
    });

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
      ...windowsList,
    ],
  };

  // Finish up.
  return menu;
}
