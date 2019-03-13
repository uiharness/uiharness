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

  const isDevTools = (id: number) => {
    return windows.byTag(TAG.DEV_TOOLS.key, TAG.DEV_TOOLS.value).some(ref => ref.id === id);
  };

  const getChildDevTools = (parentId: number) => {
    const window = getWindow(parentId);
    const children = window ? window.getChildWindows() : [];
    return children.find(window => isDevTools(window.id));
  };

  const getParentWindow = (windowId: number) => {
    let window = getWindow(windowId);
    if (window) {
      window = isDevTools(windowId) ? window.getParentWindow() : window;
    }
    return window;
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
      const isCurrent = isFocused(ref.id);
      let label = window ? window.getTitle() : '';
      if (label && refs.length > 1 && isCurrent) {
        label = `${label} (current)`;
      }
      const item: MenuItem = {
        label,
        type: 'radio',
        checked: isCurrent,
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

  const createShowDevTools = () => {
    const parent = getParentWindow(windows.focused ? windows.focused.id : -1);
    if (!parent) {
      return;
    }
    const devTools = getChildDevTools(parent.id);
    const isShowing = devTools ? devTools.isVisible() : false;
    if (!devTools || isShowing) {
      return;
    }
    return {
      label: 'Show Developer Tools',
      click: () => main.devTools.create({ parent, windows }),
    };
  };

  let submenu: MenuItem[] = [
    { label: 'New Window', accelerator: 'CommandOrControl+N', click: () => newWindow() },
    { role: 'close' },
    { role: 'minimize' },
    { type: 'separator' },
  ];

  const showDevTools = createShowDevTools();
  submenu = showDevTools ? [...submenu, showDevTools] : submenu;

  submenu = [
    ...submenu,
    {
      label: 'Hide All Developer Tools',
      click: () => allDevToolsVisible(false),
    },
    { type: 'separator' },
    ...windowsList,
  ];

  // Finish up.
  const menu: MenuItem = { label: 'Window', submenu };
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
