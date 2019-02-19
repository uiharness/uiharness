import { Menu, MenuItemConstructorOptions } from 'electron';

import { IMenuContext } from './types';
import * as about from './menu.about';
import * as edit from './menu.edit';
import * as help from './menu.help';
import * as view from './menu.view';
import * as window from './menu.window';

/**
 * Handles the creation of menus.
 */
export function createMenus(args: IMenuContext) {
  const { config, id, store, log, ipc, windows } = args;
  const context: IMenuContext = { config, id, store, log, ipc, windows };

  const template: MenuItemConstructorOptions[] = [
    edit.current(context),
    view.current(context),
    window.current(context),
    help.current(context),
  ];

  if (process.platform === 'darwin') {
    template.unshift(about.current(context));
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
