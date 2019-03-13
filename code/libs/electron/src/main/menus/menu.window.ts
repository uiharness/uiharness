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
    .pipe(filter(e => ['CREATED', 'CLOSED', 'FOCUS', 'VISIBILITY'].includes(e.type)))
    .subscribe(() => args.changed$.next());

  const allDevToolsVisible = (isVisible: boolean) => {
    windows
      .byTag(TAG.DEV_TOOLS.key, TAG.DEV_TOOLS.value)
      .forEach(ref => setWindowVisibility(ref.id, isVisible));
  };

  // Build list of active windows.
  const refs = windows.byTag(...include);
  const all = BrowserWindow.getAllWindows();

  // const getWindow = (id: number) => all.find(window => window.id === id);

  const isDevTools = (id: number) => {
    return windows.byTag(TAG.DEV_TOOLS.key, TAG.DEV_TOOLS.value).some(ref => ref.id === id);
  };

  const getChildDevTools = (parentId: number) => {
    const window = getWindow(parentId);
    const children = window ? window.getChildWindows() : [];
    return children.find(window => isDevTools(window.id));
  };

  const getChildDevToolsId = (parentId: number) => {
    const devTools = getChildDevTools(parentId);
    return devTools ? devTools.id : undefined;
  };

  const isFocused = (id: number) => {
    const focused = BrowserWindow.getFocusedWindow();
    const focusId = focused ? focused.id : undefined;
    return focusId === id || focusId === getChildDevToolsId(id);
  };

  const windowSubmenu = (parent: BrowserWindow, windowId: number) => {
    let submenu: MenuItem[] = [
      {
        label: 'Bring to Front',
        enabled: !isFocused(windowId),
        click: () => windows.visible(true, windowId),
      },
    ];

    const devToolsId = getChildDevToolsId(windowId);
    const devToolsRef = devToolsId ? windows.refs.find(ref => windowId === devToolsId) : undefined;

    if (devToolsRef && devToolsRef.isVisible) {
      submenu = [
        ...submenu,
        {
          label: 'Hide Developer Tools',
          click: () => windows.visible(false, devToolsRef.id),
        },
      ];
    }

    if (!devToolsRef || !devToolsRef.isVisible) {
      submenu = [
        ...submenu,
        {
          label: 'Show Developer Tools',
          click: () => main.devTools.create({ parent, windows }),
        },
      ];
    }

    return submenu;
  };

  const windowsList = refs
    .map(ref => {
      const window = getWindow(ref.id);
      let label = window ? window.getTitle() : '';
      if (label && refs.length > 1 && isFocused(ref.id)) {
        label = `${label} (current)`;
      }
      const submenu = window ? windowSubmenu(window, ref.id) : undefined;
      const item: MenuItem = {
        label,
        submenu,
        click: () => windows.visible(true, ref.id),
      };
      return item;
    })
    .filter(({ label }) => Boolean(label))
    .map((item, i) => {
      // Append index numbers when more than one UIHarness window.
      // NB: This is to avoid a list of window names all the same.
      return refs.length > 1 ? { ...item, label: `${i + 1}. ${item.label}` } : item;
    });

  // Construct the menu.
  const menu: MenuItem = {
    label: 'Window',
    submenu: [
      { label: 'New Window', accelerator: 'CommandOrControl+N', click: () => newWindow() },
      { role: 'close' },
      { role: 'minimize' },
      { type: 'separator' },
      {
        label: 'Hide All Developer Tools',
        click: () => allDevToolsVisible(false),
      },
      { type: 'separator' },
      ...windowsList,
    ],
  };

  // Finish up.
  return menu;
}

/**
 * [Internal]
 */
const getWindow = (id: number) => BrowserWindow.getAllWindows().find(window => window.id === id);

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
