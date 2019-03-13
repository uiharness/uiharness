import main from '@platform/electron/lib/main';
import { BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { filter } from 'rxjs/operators';

import { TAG } from '../../common';
import * as t from './types';

type MenuItem = MenuItemConstructorOptions;

/**
 * Current [window] menu state.
 */
export function current(
  args: t.IMenuContext & {
    newWindow: t.NewWindowFactory;
    include: main.IWindowTag[];
  },
) {
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

  let windowList: MenuItem[] = refs
    .map(ref => {
      const window = getWindow(ref.id);
      const isCurrent = isFocused(ref.id);
      const label = window ? window.getTitle() : '';
      const item: MenuItem = {
        label,
        type: 'radio',
        checked: isCurrent,
        click: () => windows.visible(true, ref.id),
      };
      return item;
    })
    .filter(({ label }) => Boolean(label));

  // Put (n) digit suffix on similarly named windows.
  windowList = windowList.reduce<MenuItem[]>((acc, next) => {
    const label = next.label;
    const total = windowList.map(menu => menu.label).filter(label => label === next.label).length;
    const prior = acc
      .map(menu => menu.label || '')
      .filter(label => label.startsWith(next.label || '') && /.*\(\d+\)$/.test(label)).length;
    if (total > 1) {
      next = { ...next, label: `${label} (${prior + 1})` };
    }
    return [...acc, next];
  }, []);

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
    {
      label: 'New Window',
      accelerator: 'CommandOrControl+N',
      click: () => {
        console.log(`\nTODO 🐷 Open selected entry point  \n`);
        newWindow({});
      },
    },
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
    ...windowList,
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
