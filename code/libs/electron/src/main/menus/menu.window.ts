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
    .pipe(
      filter(e =>
        ['CREATED', 'CLOSED', 'FOCUS', 'VISIBILITY'].includes(e.type),
      ),
    )
    .subscribe(() => args.changed$.next());

  // Build list of active windows.
  const refs = windows.byTag(...include);
  const all = BrowserWindow.getAllWindows();

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

  const getWindow = (id: number) => all.find(window => window.id === id);

  const isDevTools = (id: number) => {
    return windows
      .byTag(TAG.DEV_TOOLS.key, TAG.DEV_TOOLS.value)
      .some(ref => ref.id === id);
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

      let submenu: MenuItem[] = [
        {
          label: 'Bring to Front',
          click: () => setWindowVisibility(ref.id, true),
        },
      ];

      const devToolsId = getChildDevToolsId(ref.id);
      const devToolsRef = devToolsId
        ? windows.refs.find(ref => ref.id === devToolsId)
        : undefined;

      if (devToolsRef && devToolsRef.isVisible) {
        submenu = [
          ...submenu,
          {
            label: 'Hide Developer Tools',
            click: () => setWindowVisibility(devToolsRef.id, false),
          },
        ];
      }

      if (!devToolsRef || !devToolsRef.isVisible) {
        submenu = [
          ...submenu,
          {
            label: 'Show Developer Tools',
            click: () => {
              const parent = window;
              if (parent) {
                main.devTools.create({ parent, windows });
              }
            },
          },
        ];
      }

      const item: MenuItem = {
        label,
        checked: isFocused(ref.id),
        click: selectWindowHandler(ref.id),
        submenu,
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
      ...windowsList,
    ],
  };

  // Finish up.
  return menu;
}
