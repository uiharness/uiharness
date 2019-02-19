import { MenuItemConstructorOptions } from 'electron';
import { IContext } from '../types';

/**
 * Current [view] menu state.
 */
export function current(args: IContext) {
  const menu: MenuItemConstructorOptions = {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { type: 'separator' },
      {
        label: 'Show Developer Tools',
        click: () => {
          console.log('show dev tools');
          //
          // console.log(`\nTODO 🐷   show/hide dev tools on focused window \n`);
          // if (!refs.devTools || !refs.devTools.isVisible()) {
          //   // showDevTools({ refs, ...context });
          // }
        },
      },
      // { type: 'separator' },
      // { role: 'resetzoom' },
      // { role: 'zoomin' },
      // { role: 'zoomout' },
    ],
  };

  return menu;
}
